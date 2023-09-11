// @ts-check
// JsMacros.assertEvent(event, 'Service')
if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')

const logger = require('./modules/StorageManagerLogger')
// logger.setDebug(true)

const Threads = require('./lib/Threads')
const DataManager = require('./modules/DataManager')
const StorageViewScreen = require('./screens/StorageViewScreen')
const StatusElement = require('./screens/elements/StatusElement')
const InvPosPair = require('./lib/InvPosPair')

/** @type {typeof import('./screens/NameAssignmentScreen')} */
let NameAssignmentScreen // lazy require

const { statusElementPosition } = require('./positionSettings.js')

const EMPTY_CALLBACK = JavaWrapper.methodToJava(() => {})

/** @enum {TextHelper} */
const Symbols = {
  /** @readonly */ INVALID: Chat.createTextBuilder().append('-').withColor(0x7).build(),
  /** @readonly */ IGNORED: Chat.createTextBuilder().append('-').withColor(0xc).build(),
  /** @readonly */ PARTIAL: Chat.createTextBuilder().append('/').withColor(0x6).build(),
  /** @readonly */ CAN_ADD: Chat.createTextBuilder().append('+').withColor(0xa).build(),
  /** @readonly */ ADDED:   Chat.createTextBuilder().append('✔').withColor(0xa).build(),
}

/**
 * @typedef {readonly [overlayText: TextHelper, tooltip: readonly string[], clickEvent: MethodWrapper<ButtonWidgetHelper, IScreen>]} Situation
 * @type {Record<'NO_DATA' | 'UNKNOWN' | 'IGNORED' | 'PARTIAL_IGNORE' | 'PARTIAL_ADDED' | 'CAN_ADD' | 'ADDED' | 'OPEN_VIEWER', Situation>}
 * @enum {Situation}
 */
const Situations = {
  /** @readonly @type {Situation} */
  NO_DATA: [Symbols.INVALID, ['§7No Storage Data', 'Click to assign a name for this world/server'], JavaWrapper.methodToJavaAsync((a, b) => {
    situation = Situations.UNKNOWN
    if (!(currentProfile = DataManager.getCurrentProfile())) {
      ;(NameAssignmentScreen ??= require('./screens/NameAssignmentScreen')).open(currentScreen, World.getWorldIdentifier(), () => {
        currentProfile = DataManager.getCurrentProfile()
        setStatus()
      })
    }
    setStatus()
  })],
  /** @readonly @type {Situation} */
  UNKNOWN: [Symbols.INVALID, ['§7Unknown Pos', 'Either the service failed to find pos for this container', 'or this container type is not supported'], EMPTY_CALLBACK],
  /** @readonly @type {Situation} */
  IGNORED: [Symbols.IGNORED, ['§cIgnored', 'This container is ignored', 'Click to add this container'], JavaWrapper.methodToJavaAsync(() => setStatus(Situations.ADDED))],
  /** @readonly @type {Situation} */
  PARTIAL_IGNORE: [Symbols.PARTIAL, ['§cPartial Ignored', 'This container is partially ignored', 'Click to ignore the whole container'], JavaWrapper.methodToJavaAsync(() => setStatus(Situations.IGNORED))],
  /** @readonly @type {Situation} */
  PARTIAL_ADDED: [Symbols.PARTIAL, ['§aPartial Added', 'This container is partially added', 'Click to add the whole container'], JavaWrapper.methodToJavaAsync(() => setStatus(Situations.ADDED))],
  /** @readonly @type {Situation} */
  CAN_ADD: [Symbols.CAN_ADD, ['§aCan Add', 'This container can be added to the storage manager', 'Click to add this container'], JavaWrapper.methodToJavaAsync(() => setStatus(Situations.ADDED))],
  /** @readonly @type {Situation} */
  ADDED: [Symbols.ADDED, ['§aAdded', 'This container is added to the storage manager', 'Click to ignore this container'], JavaWrapper.methodToJavaAsync(() => setStatus(Situations.IGNORED))],
  /** @readonly @type {Situation} */
  OPEN_VIEWER: [Chat.createTextBuilder().append('S').withColor(0x6).build(), ['§6Click to view items', 'WIP'], JavaWrapper.methodToJavaAsync(() => { if (currentProfile) StorageViewScreen.open(null, currentProfile) })],
}

logger.debug?.('start')

/** @type {DataManager?} */
let currentProfile = DataManager.getCurrentProfile()
let inInv = 0
/** @type {IScreen?} */
let currentScreen = null
let rows = 1
let situation = Situations.NO_DATA
/** @type {BlockPosHelper?} */
let pos1 = null
/** @type {BlockPosHelper?} */
let pos2 = null

InvPosPair.on((inv, pos01, pos02) => {
  inInv = 0
  currentScreen = inv.getRawContainer()
  rows = Math.ceil(inv.getMap().container.length / 9)
  pos1 = pos01
  pos2 = pos02
  if (!pos1 && !pos2) situation = Situations.UNKNOWN
  else {
    if (!pos2) {
      if (!pos01) return
      const id = World.getBlock(pos01).getId()
      if (!currentProfile) situation = Situations.UNKNOWN
      else if (currentProfile.getChestData(pos01)) situation = Situations.ADDED
      else if (currentProfile.isIgnored(pos01)) situation = Situations.IGNORED
      else situation = Situations.CAN_ADD
      if (currentProfile) currentScreen.setOnClose(JavaWrapper.methodToJava(async () => {
        await Threads.escapeThread()
        if (!currentProfile || !pos01) return
        if (situation === Situations.IGNORED) currentProfile.setIgnored(pos01, true)
        if (situation !== Situations.ADDED || World.getBlock(pos01).getId() !== id) return
        currentProfile.setIgnored(pos01, false)
        currentProfile.setChestData(pos01, id, inv.getMap().container?.map(i => inv.getSlot(i)))
      }))
    } else {
      if (!pos01 || !pos02) return
      if (World.getBlock(pos01).getBlockState().type !== 'left') {
        const temp = pos01
        pos01 = pos02
        pos02 = temp
      }
      const id1 = World.getBlock(pos01).getId()
      const id2 = World.getBlock(pos02).getId()
      let added1 = false, added2 = false
      if (!currentProfile) situation = Situations.UNKNOWN
      else {
        added1 = !!currentProfile.getChestData(pos01)
        added2 = !!currentProfile.getChestData(pos02)
        if (added1 || added2) {
          if (added1 && added2) situation = Situations.ADDED
          else situation = Situations.PARTIAL_ADDED
        } else {
          const ignored1 = currentProfile.isIgnored(pos01)
          const ignored2 = currentProfile.isIgnored(pos02)
          if (ignored1 || ignored2) {
            if (ignored1 && ignored2) situation = Situations.IGNORED
            else situation = Situations.PARTIAL_IGNORE
          } else situation = Situations.CAN_ADD
        }
      }
      if (currentProfile) currentScreen.setOnClose(JavaWrapper.methodToJava(async () => {
        await Threads.escapeThread()
        if (!currentProfile || !pos01 || !pos02) return
        if (situation === Situations.IGNORED) {
          currentProfile.setIgnored(pos01, true)
          currentProfile.setIgnored(pos02, true)
        }
        if ((situation !== Situations.ADDED
          && situation !== Situations.PARTIAL_ADDED)
          || World.getBlock(pos01).getId() !== id1
          || World.getBlock(pos02).getId() !== id2
        ) return
        if (situation === Situations.ADDED) {
          currentProfile.setIgnored(pos01, false)
          currentProfile.setIgnored(pos02, false)
          currentProfile.setChestData(pos01, id1, inv.getMap().container?.slice(0, 27).map(i => inv.getSlot(i)))
          currentProfile.setChestData(pos02, id2, inv.getMap().container?.slice(27).map(i => inv.getSlot(i)))
        } else {
          if (added1) {
            currentProfile.setIgnored(pos01, false)
            currentProfile.setChestData(pos01, id1, inv.getMap().container?.slice(0, 27).map(i => inv.getSlot(i)))
          } else {
            currentProfile.setIgnored(pos02, false)
            currentProfile.setChestData(pos02, id2, inv.getMap().container?.slice(27).map(i => inv.getSlot(i)))
          }
        }
      }))
    }
    if (currentProfile && DataManager.Settings.getBoolean('autoAddContainer', false)
    && (situation === Situations.CAN_ADD || situation === Situations.PARTIAL_ADDED)
    ) situation = Situations.ADDED
  }
  setStatus()
})

/**
 * @param {Situation} [situation_] 
 * @returns 
 */
function setStatus(situation_) {
  if (situation_) situation = situation_
  if (!currentScreen) return
  StatusElement.clearElements(currentScreen)
  if (inInv) {
    /** @type {Situation} */// @ts-ignore
    const situation = currentProfile ? Situations.OPEN_VIEWER.slice() : Situations.NO_DATA
    if (currentProfile) {
      // @ts-ignore
      situation[1] = situation[1].slice()
      // @ts-ignore
      situation[1].push('', `§6Storage: ${currentProfile.profileName}`)
    }
    new StatusElement('minecraft:barrel', ...situation)
      .computePosThenAddTo(currentScreen, pos => statusElementPosition(pos, inInv === 1 ? 0 : -1))
  } else {
    /** @type {StatusElement} */
    let status
    if (!currentProfile) status = new StatusElement('minecraft:chest', ...Situations.NO_DATA)
    else {
      const tooltip = situation[1].slice()
      tooltip.push('', `§6Storage: ${currentProfile.profileName}`)
      if (situation !== Situations.UNKNOWN) {
        if (pos1) tooltip.push(`§7Pos1: [${pos1.getX()}, ${pos1.getY()}, ${pos1.getZ()}]`)
        if (pos2) tooltip.push(`§7Pos2: [${pos2.getX()}, ${pos2.getY()}, ${pos2.getZ()}]`)
      }
      status = new StatusElement('minecraft:chest', situation[0], tooltip, situation[2])
    }
    status.computePosThenAddTo(currentScreen, pos => statusElementPosition(pos, rows))
  }
}

JsMacros.on('OpenContainer', JavaWrapper.methodToJavaAsync(e => {
  if (e.inventory.getType() !== 'Survival Inventory' && e.inventory.getType() !== 'Creative Inventory') return
  Client.waitTick()
  currentProfile ??= DataManager.getCurrentProfile()
  inInv = e.inventory.getType() === 'Survival Inventory' ? 1 : 2
  currentScreen = e.screen
  setStatus()
}))

JsMacros.on('DimensionChange', JavaWrapper.methodToJavaAsync(() => {
  currentProfile = World.isWorldLoaded() ? DataManager.getCurrentProfile() : null
  inInv = 0
  currentScreen = null
}))

logger.debug?.('Event listeners initialized')

module.exports = {}
