//@ts-check
JsMacros.assertEvent(event, 'Key')
module.exports = 0

const RecipeHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.inventory.RecipeHelper')

const recipeManager = Client.getMinecraft().field_1687.method_8433()
const byidF = Reflection.getDeclaredField(recipeManager.getClass(), 'field_36308')
byidF.setAccessible(true)
const recipes = byidF.get(recipeManager)

const customRecipes = Array
  .from(recipes.keySet())
  .filter(id => !id.toString().startsWith('minecraft:'))
  .map(id => new RecipeHelper(recipes.get(id), 0))

if (customRecipes.length === 0) {
  Chat.log('No custom recipe found!')
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
          const y = sy - 40
          const is = Java.from(recipe.getIngredients()).filter(v => v.size() > 0)
          const sx = cx - is.length * 9
          is.forEach((it, i) => {
            const x = sx + i * 18
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
