//@ts-check
JsMacros.assertEvent(event, 'Service')
module.exports = 0

const RecipeHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.inventory.RecipeHelper')
const RecipeManager = Java.type('net.minecraft.class_1863')
const recipesByIdF = Reflection.getDeclaredField(RecipeManager, 'field_36308')
recipesByIdF.setAccessible(true)

/** @type {*} */
let lastWorld = null
/** @type {Map<string, Set<string>>} worldId => recipe ids */
const found = new Map()

JsMacros.on('ChunkLoad', JavaWrapper.methodToJavaAsync(check))
if (!check()) {
  Chat.log('§aNo custom recipe found!')
}

function check() {
  const world = World.getRaw()
  if (world === lastWorld) return 0
  lastWorld = world
  const worldId = World.getWorldIdentifier()
  if (!world || worldId.startsWith('LOCAL_')) return 0
  const recipes = getCustomRecipes(world)
  if (recipes.length === 0) return 0
  const set = found.get(worldId) ?? new Set()
  found.set(worldId, set)
  const origSize = set.size
  for (const recipe of recipes) {
    set.add(recipe.getId())
  }
  const added = set.size - origSize
  if (added > 0) {
    Chat.log(
      Chat.createTextBuilder()
        .append(`Found ${added} custom recipe${added === 1 ? '' : 's'}.`).withColor(0xa)
        .withShowTextHover(Chat.createTextHelperFromString(recipes.map(r => r.getId()).join(', ')))
        .withCustomClickEvent(JavaWrapper.methodToJavaAsync(() => openRecipeView(world)))
    )
    return added
  }
  return 0
}

function getCustomRecipes(world = World.getRaw()) {
  if (!world) return []
  // /** @type {JavaMap<any, any>} Map<Identifier, RecipeEntry<?>> */
  // const recipes = recipesByIdF.get(world.method_8433())
  return Array
    .from(recipesByIdF.get(world.method_8433()).entries())
    .filter(([id]) => !id.toString().startsWith('minecraft:'))
    .sort()
    .map(([,recipe]) => new RecipeHelper(recipe, 0))
}

function openRecipeView(world = World.getRaw()) {
  const customRecipes = getCustomRecipes(world)
  if (customRecipes.length === 0) {
    Chat.log('§aNo custom recipe found!')
  } else {
    const screen = Hud.createScreen(customRecipes.length === 1 ? 'Custom recipe' : 'Custom recipes', false)
    screen.setOnInit(JavaWrapper.methodToJava(() => {
      const cx = Math.floor(screen.getWidth() / 2)
      const cy = Math.floor(screen.getHeight() / 2)
      const size = cx * cy
      const factor = Math.sqrt(size / customRecipes.length)
      const r = Math.max(Math.floor(cx / factor), 1)
      const c = Math.ceil(customRecipes.length / r)
      const sx = cx - r * 9
      const sy = cy - c * 9
      const rx = cx - 27
      const ry = sy - 60
      const ingredBackground = screen.addRect(rx - 2, ry - 2, rx + 54, ry + 54, 0x01333333)
      const ingredTypeText = screen.addText('', cx, ry - 12, 0xFFFFFF, true)
      /** @type {RenderElement[]} */
      const ingreds = []
      customRecipes.forEach((recipe, i) => {
        const x = sx + (i % r) * 18
        const y = sy + Math.floor(i / r) * 18
        const item = recipe.getOutput()
        screen.addItem(x, y, item)
        const txt = Chat.createTextBuilder()
          .append('空空')
          .withShowItemHover(item)
          .withCustomClickEvent(JavaWrapper.methodToJava(() => {
            ingreds.splice(0, Infinity).forEach(e => screen.removeElement(e))
            ingredBackground.setAlpha(0xFF)
            ingredTypeText.setText(recipe.getType().replace(/^minecraft:/, '')).alignHorizontally('center')
            Java.from(recipe.getIngredients()).forEach((it, i) => {
              if (it.size() <= 0) return
              const x = rx + Math.max(i % 3, i - 6) * 18
              const y = ry + Math.min(Math.floor(i / 3), 2) * 18
              const fi = it.get(0)
              ingreds.push(screen.addItem(x, y, fi))
              const txt = Chat.createTextBuilder()
                .append('空空')
                .withShowItemHover(fi)
                .build()
              ingreds.push(screen.addText(txt, x - 2, y - 2, 0x05000000, false))
              ingreds.push(screen.addText(txt, x - 2, y + 6, 0x05000000, false))
              if (it.size() > 1) {
                ingreds.push(screen.addText('+', x + 5, y - 10, 0xFFFFFF, true))
              }
            })
          }))
          .build()
        screen.addText(txt, x - 2, y - 2, 0x05000000, false)
        screen.addText(txt, x - 2, y + 6, 0x05000000, false)
      })
  
      screen.addButton(cx - 64, sy + c * 18 + 8, 128, 20, 'Copy Ids', JavaWrapper.methodToJava(() => {
        Utils.copyToClipboard(Array.from(new Set(customRecipes.map(r => `'${r.getOutput().getItemId()}'`))).join(',\n'))
      }))
    }))
    Hud.openScreen(screen)
  }
}
