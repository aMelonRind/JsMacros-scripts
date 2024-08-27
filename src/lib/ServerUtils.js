//@ts-check
// base module for dedicated server utilities service.
// it can do the following:
// * add quick buttons to screens
// * auto accept tpa
// * execute remote command with /msg
// * block unwanted chat messages

const logger = require('./Logger')

/** @type {ScreenName=} */
let currentScreen = undefined
/** @type {Map<ScreenName, Map<String, Button>>} */
const buttons = new Map()
/** @type {(base: BaseContext) => object} */
let contextGetter = () => ({})

/** @type {(ctx: ButtonContext) => any} *///@ts-ignore
const focusThis = ctx => ctx.screen.method_20086(ctx.btn.getRaw())

let recvListener = null
/** @type {RecvListener[]} */
let joinedRecvListeners = []
/** @type {RecvListener[]} */
let recvListeners = []

const buttonCb = JavaWrapper.methodToJavaAsync(btn => {
  if (!currentScreen) return
  buttons.get(currentScreen)?.get(btn.getLabel().getString())?.action()
})

let instance = null
/**
 * @template {Record<string, unknown>} [Ctx={}]
 */
class ServerUtils {

  constructor() {
    if (instance) throw 'this cannot be constructured more than once!'
    instance = this

    JsMacros.on('OpenScreen', JavaWrapper.methodToJavaAsync(e => {
      if (!e.screen) return
      const screen = e.screen
      currentScreen = e.screenName
      const map = buttons.get(e.screenName)
      if (map) {
        const p = Player.getPlayer()
        if (!p) return
        /** @type {BaseContext & Record<string, unknown>} */
        let ctx = {
          screen: screen,
          player: p,
          server: World.getDimension() ?? undefined,
          inv: Player.openInventory()
        }
        ctx = Object.assign(contextGetter(ctx), ctx)
        /** @type {Button[]} */
        const visible = [...map.values()].filter(btn => btn.condition(ctx))
        if (visible.length) {
          for (let i = 0; i < 10 && screen.getWidth() === 0; i++)
            Client.waitTick()
          const x = Math.max(Math.floor(screen.getWidth() / 2) - 280, 10)
          const y = Math.max(Math.floor((screen.getHeight() - (visible.length * 30 - 10)) / 2), 10)
          visible.forEach((button, i) => {
            if (button.icon && x > 24)
              screen.addItem(x - 20, y + i * 30 + 1, button.icon)
            const btn = screen.addButton(x, y + i++ * 30, 64, 20, button.name, buttonCb)
            //@ts-ignore
            button.onAdd?.({ btn, ...ctx })
          })
        }
      }
    }))
  }

  /**
   * @param {(base: BaseContext) => Ctx} getter 
   */
  setAdditionalContextGetter(getter) {
    contextGetter = getter
    return this
  }

  /**
   * @param {ScreenName} screenType 
   * @param {string} name 
   * @returns {ButtonBuilder<Ctx>}
   */
  addButton(name, screenType = 'Survival Inventory') {
    return new ButtonBuilder(screenType, name)
  }

  /**
   * @param {ScreenName} screenType 
   * @returns {ScreenButtonsBuilder<Ctx>}
   */
  buttonGroup(screenType) {
    return new ScreenButtonsBuilder(screenType)
  }

  /**
   * @param {RecvListener} listener returned value indicates if the event is handled
   */
  addRecvMessageListener(listener, joined = false) {
    enableRecvListener()
    ;(joined ? joinedRecvListeners : recvListeners).push(listener)
    return this
  }

  /**
   * @param {RegExp} regex the regex to match tpa string. with one capturing group captures the player name.
   * @example /^(\w+) has requested to teleport to you\.$/
   * @param {string} cmd the string to accept tpa. `%player%` placeholder will be replaced with the captured player name.
   * @param {Iterable<string>} list list of trusted players. should be as the same format as captured player name in the regex.
   * @returns 
   */
  autoAcceptTpa(regex, cmd, list) {
    enableRecvListener()
    const set = new Set(list)
    recvListeners.push(str => {
      const match = str.match(regex)
      if (match) {
        const name = match[1]
        if (set.has(name)) {
          JavaWrapper.methodToJavaAsync(() => Chat.say(cmd.replace('%player%', name))).run()
          logger.log('Auto accepted tp.')
          return true
        }
      }
    })
    return this
  }

  /**
   * @param {(RegExp | string)[]} list the messages to block.
   * @returns 
   */
  blockMessages(...list) {
    enableRecvListener()
    /** @type {RegExp[]} */
    const regexes = []
    /** @type {Set<string>} */
    const strings = new Set()
    for (const e of list) {
      if (typeof e === 'string')
        strings.add(e)
      else
        regexes.push(e)
    }
    joinedRecvListeners.push((str, ev) => {
      if (strings.has(str) || regexes.some(reg => reg.test(str))) {
        ev.cancel()
        return true
      }
    })
    return this
  }

  /**
   * @param {RegExp} regex the regex to match dm string. with two capturing group captures the player name and the command.
   * @example /^\[(\w+) -> me\] run (\/.+)$/
   * @param {Iterable<string>} list list of trusted players. should be as the same format as captured player name in the regex.
   * @param {string[]} blacklist blacklisted command prefixes, default has basic dm commands.
   * @default blacklist = ['/msg ', '/m ', '/tell ', '/t ']
   * @returns 
   */
  allowRemoteCommand(regex, list, blacklist = ['/msg ', '/m ', '/tell ', '/t ']) {
    enableRecvListener()
    const set = new Set(list)
    recvListeners.push(str => {
      const match = str.match(regex)
      if (match) {
        const name = match[1]
        if (set.has(name)) {
          const cmd = match[2]
          if (cmd?.startsWith('/') && !blacklist.some(b => cmd.startsWith(b))) {
            Chat.say(cmd)
            return true
          }
        }
      }
    })
    return this
  }

}

/**
 * @template {Record<string, unknown>} Ctx
 */
class Button {
  /** @readonly */ name
  /** @readonly */ action
  /** @readonly */ condition
  /** @readonly */ onAdd

  /**
   * @param {string} name 
   * @param {CanOmitNamespace<ItemId>?} [icon] 
   * @param {() => any} [action] 
   * @param {(ctx: BaseContext & Ctx) => any} [condition] 
   * @param {((ctx: ButtonContext & Ctx) => any)?} [onAdd] 
   */
  constructor(name, icon = null, action = (() => {}), condition = () => true, onAdd = null) {
    this.name = name
    this.icon = icon
    this.action = action
    this.condition = condition
    this.onAdd = onAdd
  }
}

/**
 * @template {Record<string, unknown>} Ctx
 */
class ScreenButtonsBuilder {
  
  /**
   * @param {ScreenName} screenType 
   */
  constructor(screenType) {
    this.screenType = screenType
  }

  /**
   * @param {string} name 
   * @returns {ButtonBuilder<Ctx>}
   */
  addButton(name) {
    return new ButtonBuilder(this.screenType, name)
  }

}

/**
 * @template {Record<string, unknown>} Ctx
 */
class ButtonBuilder {
  /** @readonly @type {string} */ name
  focus = false
  /**
   * @param {ScreenName} screenType 
   * @param {string} name 
   */
  constructor(screenType, name) {
    this.screenType = screenType
    this.name = name
  }

  /**
   * the icon for this button
   * @param {CanOmitNamespace<ItemId>} item 
   */
  setIcon(item) {
    this.icon = item
    return this
  }

  /**
   * sets the action
   * @param {() => any} action 
   */
  runs(action) {
    this.action = action
    return this
  }

  /**
   * sets action to () => Chat.say(str)
   * @param {string} str 
   */
  says(str) {
    this.action = () => Chat.say(str)
    return this
  }

  /**
   * the callback to determine if this button is visible
   * @param {(ctx: BaseContext & Ctx) => any} condition 
   */
  setCondition(condition) {
    this.condition = condition
    return this
  }

  /**
   * the callback that runs on button add
   * @param {(ctx: ButtonContext & Ctx) => any} onAdd 
   */
  setOnAdd(onAdd) {
    this.onAdd = onAdd
    return this
  }

  /**
   * if this button should be focused
   */
  setFocus() {
    this.focus = true
    return this
  }

  /**
   * @returns {Button<Ctx>}
   */
  build() {
    let add = this.onAdd
    if (this.focus) {
      if (add) {
        const orig = add
        add = ctx => {
          orig(ctx)
          focusThis(ctx)
        }
      } else {
        add = focusThis
      }
    }
    const btn = new Button(this.name, this.icon, this.action, this.condition, add)
    const map = buttons.get(this.screenType) ?? (() => {
      const map = new Map()
      buttons.set(this.screenType, map)
      return map
    })()
    map.set(this.name, btn)
    return btn
  }

}

function enableRecvListener() {
  recvListener ??= JsMacros.on('RecvMessage', JsMacros.eventFilters().noJoinTriggering(), true, JavaWrapper.methodToJava((e, ctx) => {
    const str = e.text?.getString()
    if (!str) return
    if (joinedRecvListeners.some(lis => lis(str, e) || e.text == null)) return
    ctx.releaseLock()
    recvListeners.some(lis => lis(str, e))
  }))
}

/**
 * a toggle button for uiutils because the mod doesn't have it.  
 * only works if you have uiutils installed.
 * @param {ServerUtils | ScreenButtonsBuilder} adder 
 */
function addUiUtilToggleButton(adder) {
  /** @type {{ enabled: boolean }} */
  let uiu
  try { //@ts-ignore
    uiu = Java.type('org.uiutils.SharedVariables')
  } catch {
    return
  }
  uiu.enabled = false

  adder.addButton('uiutils')
    .setIcon('minecraft:debug_stick')
    .runs(() => uiu.enabled = !uiu.enabled)
    .build()
}

module.exports = { ServerUtils, addUiUtilToggleButton }

/**
 * @typedef {{
 *  readonly screen: IScreen
 *  readonly player: ClientPlayer
 *  readonly inv: Inventory
 *  readonly server: string | undefined
 * }} BaseContext
 * @typedef {BaseContext & { readonly btn: ClickableWidgetHelper }} ButtonContext
 * @typedef {(str: string, event: Events.RecvMessage) => boolean | void} RecvListener
 */
