
// just a fun script that will consume bonemeal to plane flowers around you
// is key script

GlobalVars.putBoolean("GardenerToggle", !
GlobalVars.getBoolean("GardenerToggle"))

const d3d = Hud.createDraw3D()
const worldHeight = World.getDimension() === 'minecraft:overworld' ? [-64, 319] : [0, 255]
const weeds = []
const grass = []
let lastPpos = Player.getPlayer().getBlockPos()
let done = false

if (GlobalVars.getBoolean('GardenerToggle')) {
  Chat.log('[Gardener] started')
  d3d.register()
  while (GlobalVars.getBoolean('GardenerToggle')) {
    plant()
    Time.sleep(10)
  }
  d3d.unregister()
  Chat.log('[Gardener] stopped')
}

function plant() {
  const update = playerPosUpdate()
  if (!update && done) return
  if (update) {
    scanWeeds()
    scanGrass()
  }
  if (weeds.length === 0) scanWeeds()
  while (weeds.length > 0) {
    if (!['grass', 'tall_grass', 'fern', 'large_fern'].includes(World.getBlock(...weeds[0])?.getId().slice(10))) {
      weeds.shift()
      continue
    }
    Player.getPlayer().attack(...weeds[0], 1)
    return
  }
  if (grass.length === 0) scanGrass()
  while (grass.length > 0) {
    if (!(World.getBlock(...grass[0]).getId().slice(10) === 'grass_block' &&
        ['air', 'cave_air', 'grass', 'tall_grass', 'fern', 'large_fern'].includes(World.getBlock(...grass[0])?.getId().slice(10)))) {
      grass.shift()
      render()
      continue
    }
    if (!pick(3, ['bone_meal'])) {
      done = true
      return
    }
    Player.getPlayer().interactBlock(...grass[0], 1, false)
    return
  }
  done = true
}

function playerPosUpdate() {
  const ppos = Player.getPlayer().getBlockPos()
  if (lastPpos.x != ppos.x || lastPpos.y != ppos.y || lastPpos.z != ppos.z) {
    lastPpos = ppos
    done = false
    return true
  }
  return false
}

function scanWeeds() {
  weeds.splice(0, weeds.length)
  const ppos = Player.getPlayer().getBlockPos()
  for (let y = 5; y > -6; y--) for (let z = -5; z < 6; z++) for (let x = -5; x < 6; x++) {
    const b = [ppos.x + x, ppos.y + y, ppos.z + z]
    if (b[1] < worldHeight[0] || b[1] > worldHeight[1]) continue
    if (isReachable(...b) && ['grass', 'tall_grass', 'fern', 'large_fern'].includes(World.getBlock(...b)?.getId().slice(10))) weeds.push(b)
  }
}

function scanGrass() {
  grass.splice(0, grass.length)
  const ppos = Player.getPlayer().getBlockPos()
  for (let y = -2; y < 3; y++) for (let z = -2; z < 3; z++) for (let x = -2; x < 3; x++) {
    const b = [ppos.x + x, ppos.y + y, ppos.z + z]
    if (b[1] < worldHeight[0] || b[1] > worldHeight[1]) continue
    if (World.getBlock(...b).getId().slice(10) === 'grass_block' &&
      ['air', 'cave_air', 'grass', 'tall_grass', 'fern', 'large_fern'].includes(World.getBlock(b[0], b[1] + 1, b[2]).getId().slice(10))) grass.push(b)
  }
  render()
}

function render() {
  for (const b of d3d.getBoxes()) d3d.removeBox(b)
  for (const g of grass) d3d.addBox(...g, ...g.map(v => v + 1), 65535, 0, false)
}

const Vec3d = Java.type('net.minecraft.class_243')
function isReachable(x, y, z) {
  const p = Player.getPlayer()
  return p.getRaw().method_5707(new Vec3d(x + 0.5, y + 0.5 - p.getEyeHeight(), z + 0.5)) < 27 // .squaredDistanceTo(Vec)
}

function pick(slot, items) {
  const inv = Player.openInventory()
  if (items.includes(inv.getSlot(inv.getMap().hotbar[slot]).getItemId().slice(10))) {
    inv.setSelectedHotbarSlotIndex(slot)
    Client.waitTick()
    return true
  }
  for (const s of inv.getMap().main) if (items.includes(inv.getSlot(s).getItemId().slice(10))) {
    inv.setSelectedHotbarSlotIndex(slot)
    Client.waitTick()
    inv.swapHotbar(s, slot)
    return true
  }
  for (const s of inv.getMap().hotbar) if (items.includes(inv.getSlot(s).getItemId().slice(10))) {
    inv.setSelectedHotbarSlotIndex(slot)
    inv.swapHotbar(s, slot)
    Client.waitTick()
    return true
  }
  Chat.actionbar(`Can't find ${items.join(' or ').replace(/_/g, ' ')} in your inventory.`, false)
  return false
}