// https://baritone.leijurv.com/
/** @type {import('./BaritoneLiteTypes').BaritoneAPI} */
const BaritoneAPI = any(Java.type('baritone.api.BaritoneAPI'))
/** @type {new () => import('./BaritoneLiteTypes').Setting<any>} */
const BaritoneSetting = any(Java.type('baritone.api.Settings.Setting'))

/** @type {Partial<Record<keyof import('./BaritoneLiteTypes').Settings, any>>} */
const settings = {
  maxFallHeightNoWater: 16,
  freeLook: true,
  allowParkour: false,
  allowBreak: false,
  allowPlace: false,
  allowSprint: false,
  allowVines: true,
  antiCheatCompatibility: true
}

/** @type {import('./BaritoneLiteTypes').Settings} */
const baritoneSettings = BaritoneAPI.getSettings()
for (const key in settings) {
  const setting = baritoneSettings[key]
  if (!setting || !(setting instanceof BaritoneSetting)) throw `Invalid settings key ${key}`
  setting.value = settings[key]
}

/** @type {new (pos: RawBlockPos, range: int) => import('./BaritoneLiteTypes').Goal} */
const GoalNear = any(Java.type('baritone.api.pathing.goals.GoalNear'))
/**
 * @type {{
 *  new (pos: RawBlockPos) => import('./BaritoneLiteTypes').Goal
 *  new (x: int, y: int, z: int) => import('./BaritoneLiteTypes').Goal
 * }}
 */
const GoalBlock = any(Java.type('baritone.api.pathing.goals.GoalBlock'))

module.exports = {
  BaritoneAPI,
  GoalNear,
  GoalBlock,
  getGoalProcess() {
    return BaritoneAPI.getProvider().getPrimaryBaritone().getCustomGoalProcess()
  }
}

function any(v) {
  return v
}
