// @ts-check
// just a random script that runs on a random server that has archaeology cave
JsMacros.assertEvent(event, 'Key')
module.exports = 0

// commented out parts are just an attempt to crack the spawning rule, but it failed.
// const map = GlobalVars.getObject('SusSandContentMap')
// const ItemStack = Java.type('net.minecraft.class_1799')
// const ItemStackHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper')
const skyExposed = PositionCommon.createBlockPos(8, 49, 65)

function main() {
  const key = 'SusSandTracker'
  /** @type {Draw3D} */
  const d3d = GlobalVars.getObject(key) ?? Hud.createDraw3D()
  d3d.unregister().clear()
  if (!World.getDimension()?.endsWith('archeology')) return

  const adjacents = [
    [-1, 0, 0],
    [0, 0, -1],
    [ 1, 0, 0],
    [0,  1, 0],
    [0, 0,  1] //@ts-ignore
  ].map(/** @type {(v: number[]) => Pos3D} */ v => PositionCommon.createPos(...v))
  // 0, 0
  // 5, 5
  const scanner = World.getWorldScanner().withStringBlockFilter().equals('BlockHelper:{"id": "minecraft:suspicious_sand"}').build()
  /** @type {Pos3D[]} */
  const epics = []
  const epicLore = '{"bold":false,"italic":false,"underlined":false,"strikethrough":false,"obfuscated":false,"color":"light_purple","text":"價值不菲..."}'
  const blocks = scanner.scanCubeAreaInclusive(8, -17, 14, 81, 51, 88)
  .filter(pos => {
    const nbt = World.getBlock(pos)?.getNBT()
    // const item = new ItemStackHelper(ItemStack.method_7915(nbt?.get('item')?.getRaw()))
    // if (!item.isEmpty()) {
    //   map.put(pos.toBlockPos(), item.getName().getString())
    // }
    if (nbt?.resolve('item.tag.display.Lore[-1]')?.[0]?.asString() === epicLore) {
      epics.push(pos)
      return false
    }
    if (nbt?.resolve('item{Count:1b}')?.isEmpty() === false) return false
    const down = World.getBlock(pos.add(0, -1, 0))
    if (down?.getBlockStateHelper().isAir() || down?.getId().endsWith('sand') && World.getBlock(pos.add(0, -2, 0))?.getBlockStateHelper().isAir()) return false
    const offAdj = adjacents.map(off => pos.add(off))
    if (offAdj.every(off => World.getBlockLight(off.x, off.y, off.z) === 0)) return false
    if (pos.x === 28 || skyExposed.distanceTo(pos) < 8) return true
    return offAdj.every(off => World.getSkyLight(off.x, off.y, off.z) === 0)
  })
  if (!blocks.length) return

  GlobalVars.putObject(key, d3d.register())
  for (const pos of blocks) {
    d3d.addBox(pos.x, pos.y, pos.z, pos.x + 1, pos.y + 1, pos.z + 1, 0x0000FF, 0, false)
  }
  for (const pos of epics) {
    d3d.addBox(pos.x, pos.y, pos.z, pos.x + 1, pos.y + 1, pos.z + 1, 0xFF0000, 0, false)
  }
  if (epics.length) Chat.log(`Found ${epics.length} epic`)
  Chat.actionbar(`Found ${blocks.length} unbrushed`)
}

main()
