//@ts-check
// this script works together with AdvancedXray mod, boosting scan speed and immediate updates, also with breath checks.
// totally not because i'm too lazy to make a config saveload system.
// https://www.curseforge.com/minecraft/mc-mods/advanced-xray-fabric-edition
JsMacros.assertEvent(event, 'Service')
module.exports = 0

const path = file.getPath()
let enabled = GlobalVars.getBoolean(`${path}:enabled`) ?? false
let trace = GlobalVars.getBoolean(`${path}:trace`) ?? false
let checkBreath = GlobalVars.getBoolean(`${path}:checkBreath`) ?? false

/** @type {*} */
const BlockStore = Java.type('pro.mikey.fabric.xray.storage.BlockStore')
/** @type {*} */
const GuiSelectionScreen = Java.type('pro.mikey.fabric.xray.screens.forge.GuiSelectionScreen')
const BlockStateHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.world.BlockStateHelper')

const filters = JsMacros.eventFilters()
const d3d = Hud.createDraw3D().register()
/** @type {BlockSearchEntry[]} */
const entries = []
/** @type {['up', 'down', 'north', 'south', 'east', 'west']} */
const directions = ['up', 'down', 'north', 'south', 'east', 'west']
/** @type {MethodWrapper<Pos3D, any, boolean>} */
const cantBreath = JavaWrapper.methodToJava(pos => {
  const bpos = pos.toBlockPos()
  return !directions.some(dir => {
    const block = World.getBlock(bpos[dir]())
    if (!block) return false
    return block.getBlockStateHelper().isAir() || block.getId() === 'minecraft:fire'
  })
})

// region entry class
class BlockSearchEntry {
  /** @type {*} */ static world 
  /** @readonly @type {BlockId} */ id 
  /** @type {WorldScanner?} */ scanner 
  /** @readonly @type {number} */ color 
  /** @readonly @type {JavaMap<`${number},${number}`, [Box[], TraceLine[]]>} */ map = JavaUtils.createHashMap()

  static init() {
    const bs = BlockStore.getInstance()
    bs.updateCache()
    for (const ent of bs.getCache().get()) {
      const id = new BlockStateHelper(ent.getState()).getId()
      const c = ent.getColor()
      const color = ((c.red() & 255) << 16) | ((c.green() & 255) << 8) | (c.blue() & 255)
      entries.push(new BlockSearchEntry(id, color))
    }
    this.world = null
    this.checkWorld()
  }

  static scanAround() {
    d3d.clear()
    for (const ent of entries) {
      ent.map.clear()
    }
    if (!enabled) return
    const pos = Player.getPlayer()?.getChunkPos()
    if (!pos) return
    const range = Client.getGameOptions().getVideoOptions().getRenderDistance() + 1
    for (let z = -range; z <= range; z++) for (let x = -range; x <= range; x++) {
      const p = pos.add(x, z)
      if (World.isChunkLoaded(p.x, p.y)) {
        for (const ent of entries) {
          ent.scanChunk(p.x, p.y)
        }
      }
    }
  }

  static checkWorld() {
    if (this.world !== World.getRaw()) {
      this.world = World.getRaw()
      for (const ent of entries) {
        ent.buildScanner()
        ent.map.clear()
      }
      d3d.clear()
    }
  }

  /**
   * @param {BlockId} id 
   * @param {number} color 
   */
  constructor (id, color) {
    this.id = id
    this.color = color

    this.el = JsMacros.on('BlockUpdate', filters.compile('BlockUpdate', `eq(event.block.getId(), "${this.id}")`), JavaWrapper.methodToJava(e => {
      const pos = e.block.getBlockPos()
      this.scanChunk(pos.getX() >> 4, pos.getZ() >> 4)
    }))
  }

  buildScanner() {
    this.scanner = BlockSearchEntry.world ? World.getWorldScanner().withBlockFilter('getId').is('EQUALS', this.id).build() : null
  }

  /**
   * @param {number} x 
   * @param {number} z 
   */
  scanChunk(x, z) {
    if (!enabled) return
    this.unload(x, z)
    let res = null
    try {
      res = this.scanner?.scanChunkRange(x, z, 0)
    } catch {
      return
    }
    if (!res?.size()) return
    if (checkBreath) {
      res.removeIf(cantBreath)
    }
    if (res.isEmpty()) return
    this.map.put(`${x},${z}`, [
      res.map(({ x, y, z }) => d3d.addBox(x, y, z, x + 1, y + 1, z + 1, this.color, 0, false)),
      trace ? res.map(({ x, y, z }) => d3d.addTraceLine(x + 0.5, y + 0.5, z + 0.5, this.color)) : []
    ])
  }

  /**
   * @param {number} x 
   * @param {number} z 
   */
  unload(x, z) {
    const elem = this.map.remove(`${x},${z}`)
    if (elem) {
      for (const box of elem[0]) {
        d3d.removeBox(box)
      }
      for (const line of elem[1]) {
        d3d.removeTraceLine(line)
      }
    }
  }
}

// region init
BlockSearchEntry.init()

JsMacros.on('ChunkLoad', JavaWrapper.methodToJava(e => {
  BlockSearchEntry.checkWorld()
  for (const ent of entries) {
    ent.scanChunk(e.x, e.z)
  }
  if (checkBreath) {
    for (const ent of entries) {
      ent.scanChunk(e.x - 1, e.z)
      ent.scanChunk(e.x + 1, e.z)
      ent.scanChunk(e.x, e.z - 1)
      ent.scanChunk(e.x, e.z + 1)
    }
  }
}))
JsMacros.on('ChunkUnload', JavaWrapper.methodToJava(e => {
  for (const ent of entries) {
    ent.unload(e.x, e.z)
  }
}))
/** @type {JavaSet<Pos2D>} */
const bufferedAirUpdates = JavaUtils.createHashSet()
JsMacros.on('BlockUpdate', filters.compile('BlockUpdate', 'event.block.getBlockStateHelper().isAir()'), JavaWrapper.methodToJava(e => {
  const bpos = e.block.getBlockPos()
  const x = bpos.getX()
  const z = bpos.getZ()
  bufferedAirUpdates.add(PositionCommon.createPos(x >> 4, z >> 4))
  if (checkBreath) {
    bufferedAirUpdates.add(PositionCommon.createPos((x - 1) >> 4, z >> 4))
    bufferedAirUpdates.add(PositionCommon.createPos((x + 1) >> 4, z >> 4))
    bufferedAirUpdates.add(PositionCommon.createPos(x >> 4, (z - 1) >> 4))
    bufferedAirUpdates.add(PositionCommon.createPos(x >> 4, (z + 1) >> 4))
  }
}))
JsMacros.on('Tick', filters.modulus(8), JavaWrapper.methodToJava(() => {
  if (!bufferedAirUpdates.isEmpty()) {
    BlockSearchEntry.checkWorld()
    for (const pos of bufferedAirUpdates) {
      for (const ent of entries) ent.scanChunk(pos.x, pos.y)
    }
    bufferedAirUpdates.clear()
  }
}))

BlockSearchEntry.scanAround()

// region buttons
JsMacros.on('OpenScreen', JavaWrapper.methodToJavaAsync(e => {
  const s = e.screen
  if (s && (s instanceof GuiSelectionScreen)) {
    Client.waitTick()
    const x = Math.floor(s.getWidth() / 2)
    const y = Math.floor(s.getHeight() / 2) + 120
    s.addButton(x - 110, y, 100, 20, colored('Enabled', enabled, true), JavaWrapper.methodToJava(btn => {
      enabled = !enabled
      GlobalVars.putBoolean(`${path}:enabled`, enabled)
      btn.setLabel(colored('Enabled', enabled))
      BlockSearchEntry.scanAround()
    }))
    s.addButton(x - 110, y + 30, 100, 20, 'Update List', JavaWrapper.methodToJava(btn => {
      d3d.clear()
      for (const ent of entries.splice(0, Infinity)) {
        ent.map.clear()
        ent.el.off()
      }
      BlockSearchEntry.init()
      BlockSearchEntry.scanAround()
    }))
    s.addButton(x + 10, y, 100, 20, colored('Trace', trace, true), JavaWrapper.methodToJava(btn => {
      trace = !trace
      GlobalVars.putBoolean(`${path}:trace`, trace)
      btn.setLabel(colored('Trace', trace))
      BlockSearchEntry.scanAround()
    }))
    s.addButton(x + 10, y + 30, 100, 20, colored('Check Breath', checkBreath, true), JavaWrapper.methodToJava(btn => {
      checkBreath = !checkBreath
      GlobalVars.putBoolean(`${path}:checkBreath`, checkBreath)
      btn.setLabel(colored('Check Breath', checkBreath))
      BlockSearchEntry.scanAround()
    }))
  }
}))

/**
 * @param {string} label 
 * @param {boolean} value 
 * @param {boolean} [raw] 
 * @overload
 * @param {string} label 
 * @param {boolean} value 
 * @param {false} [raw] 
 * @returns {TextHelper}
 * @overload
 * @param {string} label 
 * @param {boolean} value 
 * @param {true} raw 
 * @returns {string}
 */
function colored(label, value, raw = false) {
  return raw
  ? `§${value ? 'a' : 'c'}${label}`
  : Chat.createTextBuilder().append(label).withColor(value ? 0xa : 0xc).build()
}

event.unregisterOnStop(true, d3d)
