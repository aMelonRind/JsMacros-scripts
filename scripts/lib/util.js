
/**
 * useful multi-purpose module
 * @exports util
 */

if (context.getCtx().getFile().getPath() === __filename)
  throw 'util is a module!\nuse `const util = require(/* path to util.js */)` to load it.'

const StringNbtReader = Java.type('net.minecraft.class_2522')
const ItemStack       = Java.type('net.minecraft.class_1799')
const ItemStackHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper')
const Identifier      = Java.type('net.minecraft.class_2960')
const ItemRegistry    = Java.type('net.minecraft.class_2378').field_11142

const InvScreen = Java.type('net.minecraft.class_490')
const Inventory = Java.type('xyz.wagyourtail.jsmacros.client.api.classes.Inventory')

const Pos3D = Java.type('xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D')
const Vec3D = Java.type('xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Vec3D')

/** @type {{ [data: string]: ItemStackHelper }} */
const itemCache = {}

const D2R = Math.PI / 180

let tickClock = 1
const tickQueue = {}
/** @type {Promise<never>} */
const never = new Promise(() => null)

class Util {

  scriptName = 'UnnamedScript'

  /** @alias {@link JavaWrapper.methodToJava} */
  toJava = JavaWrapper.methodToJava

  /** @alias {@link PositionCommon.createPos} */
  Pos = PositionCommon.createPos

  /** @alias {@link PositionCommon.createVec} */
  Vec = PositionCommon.createVec

  /**
   * convert various pos to Pos3D
   * @param {Pos3DLike} pos 
   * @returns {Pos3D}
   */
  toPos(pos) {
    if (pos instanceof Pos3D) return pos
    // if (!pos) return util.Pos(0, 0, 0)
    if (Array.isArray(pos))
      return this.Pos(pos[0], pos[1], pos[2])
    if ('x' in pos && 'y' in pos && 'z' in pos)
      return this.Pos(pos.x, pos.y, pos.z)
    if ('getX' in pos && 'getY' in pos && 'getZ' in pos)
      return this.Pos(pos.getX(), pos.getY(), pos.getZ())
    util.throw(`can't identify pos (${pos})`)
  }

  /**
   * convert various vec to Vec3D
   * @param {Vec3DLike} vec 
   * @returns {Vec3D}
   */
  toVec(vec) {
    if (vec instanceof Vec3D) return vec
    // if (!vec) return util.Vec(0, 0, 0, 0, 0, 0)
    if (Array.isArray(vec))
      return this.Vec(...vec.flat())
    util.throw(`can't identify vec (${vec})`)
  }

  /**
   * enable smooth look or not
   */
  enableSmoothLook = true

  /**
   * max degree for smooth look
   */
  lookMaxDegree = 50

  /**
   * call all callback in {@link util.stopListeners} then try to close script
   * @param {string} [reason]
   */
  stopAll(reason) {
    this.stopListeners.splice(0).forEach(cb => cb())
    if (reason) Chat.log(this.getPrefix().append(`${reason}`).withColor(0x6).build())
    this.quit()
  }

  /**
   * will halt the script and quit in 3 seconds  
   * without any message  
   * (technically it's deleting error with onFrame)  
   * not recommended, but i've implemented it anyways  
   * [reason of it's not recommended](https://discord.com/channels/732004268948586545/1098255667371982858/1098375801222738001)
   * @returns {never}
   */
  quit() {
    const e = JsMacros.createCustomEvent('e')
    e.putObject('ctx', context.getCtx())
    JsMacros.runScript('js', `
      const history = Chat.getHistory()
      const del = [
        'Thread was interrupted.',
        'Context execution was cancelled.',
        'java.lang.IllegalStateException',
        'java.lang.InterruptedException',
        'java.lang.RuntimeException',
        'IllegalStateException',
        'CancelExecution: ',
        'java.lang.NullPointerException: Cannot invoke "com.oracle.truffle.js.lang.JavaScriptLanguage.getJSContext()"'
      ]
      const frameListener = Reflection.createClassProxyBuilder(
          Java.type('xyz.wagyourtail.jsmacros.client.api.classes.Draw2D'))
          .addMethod('render', JavaWrapper.methodToJava(() => {
        try {
          for (let x = 0, s; x <= 10; x++) {
            s = history.getRecvLine(x).getText().getString()
            if (del.some(d => s.startsWith(d))) {
              history.removeRecvText(x)
              history.refreshVisible()
              frameListener.unregister()
            }
          }
        }catch (e) {}
      })).buildInstance([])
      frameListener.register()
      event.getObject('ctx').closeContext()
      Client.waitTick(60)
      frameListener.unregister()
      context.getCtx().closeContext()`,
      null, e, JavaWrapper.methodToJava(() => null)
    )
    while (true) Client.waitTick()
  }

  /**
   * push stop listener here  
   * better not async callback
   * @readonly
   */
  stopListeners = [
    () => {
      listeners.splice(0).forEach(l => JsMacros.off(l))
      Object.values(wfeListeners).forEach(l => JsMacros.off(l.listener))
    }
  ]

  /** @readonly */
  get glfw() {
    const value = require('./GLFW')
    Object.defineProperty(this, 'glfw', { value })
    return value
  }

  /** @readonly */
  get movement() {
    const value = require('./handlers/Movement')
    Object.defineProperty(this, 'movement', { value })
    return value
  }

  /** @readonly */
  get actionbar() {
    const value = require('./AdvancedActionbar')
    Object.defineProperty(this, 'actionbar', { value })
    return value
  }

  /** @readonly */
  get crafting() {
    const value = require('./handlers/Crafting')
    Object.defineProperty(this, 'crafting', { value })
    return value
  }

  /** @readonly */
  get container() {
    const value = require('./handlers/Container')
    Object.defineProperty(this, 'container', { value })
    return value
  }

  /** @readonly */
  get storage() {
    const value = require('./handlers/Storage')
    Object.defineProperty(this, 'storage', { value })
    return value
  }

  /**
   * current tick time  
   * won't flashback like {@link World.getTime()}
   */
  get ticks() {
    return tickClock
  }

  /**
   * @async
   * @param {number} ticks
   * @returns {Promise<void>=}
   */
  waitTick(ticks = 1) {}

  /**
   * @async
   * @template R
   * @param {number} ticks
   * @param {() => R} [callback]
   * @returns {Promise<void> | R}
   */
  waitTick(ticks = 1, callback) {
    if (typeof ticks !== 'number') this.throw('ticks must be a number')
    if (ticks <= 0) return callback?.()
    if (ticks === Infinity) return never
    ticks = Math.ceil(ticks) + tickClock
    return new Promise(res => {
      if (tickQueue[ticks]) {
        if (Array.isArray(tickQueue[ticks])) tickQueue[ticks].push(res)
        else tickQueue[ticks] = [ tickQueue[ticks], res ]
      } else tickQueue[ticks] = res
    }).then(() => callback?.())
  }

  /**
   * alias for {@link JsMacros.on} but will also register to {@link listeners}  
   * and don't need to wrap the callback
   * @template {keyof Events} E
   * @param {E} event 
   * @param {EventCallback<E> | MethodWrapper<Events[E], Context, void, any>} callback 
   * @returns {IEventListener}
   */
  on(event, callback) {
    if (typeof callback === 'function')
      callback = JavaWrapper.methodToJava(callback)
    event = JsMacros.on(event, callback)
    listeners.push(event)
    return event
  }

  /**
   * 
   * @async
   * @template {keyof Events} E
   * @param {E} event 
   * @param {EventCallback<E, boolean>} [condition] 
   * @param {EventCallback<E>} [callback] 
   * @param {number} timeout 
   * @returns {Promise<?{event: Events[E], context: Context}> & { cancel(): void }}
   */
  waitForEvent(event, condition, callback, timeout = 600) {
    const cb = { condition, callback }
    const res = new Promise(res => cb.res = res)
    res.cancel = () => {
      cb.res(null)
      cb.cancel = true
    }
    if (timeout > 0) this.waitTick(timeout, res.cancel)
    wfeListeners[event] ??= {
      listener: JsMacros.on(event, this.toJava((e, c) => {
        if (!wfeListeners[event]) return
        wfeListeners[event].cbs.reduceRight((_, cb, i, a) => {
          if (cb.cancel) return a.splice(i, 1)
          if (!cb.condition || cb.condition(e, c)) {
            cb.res({ event: e, context: c })
            cb.callback?.(e, c)
            a.splice(i, 1)
          }
        }, 0)
        if (wfeListeners[event].cbs.length) return
        JsMacros.off(wfeListeners[event].listener)
        delete wfeListeners[event]
      })),
      cbs: []
    }
    wfeListeners[event].cbs.push(cb)
    return res
  }

  /**
   * if there's expensive sync loop in async script  
   * await this
   */
  waitImmediate() {
    return new Promise(res => JavaWrapper.methodToJavaAsync(res).run())
  }

  getPrefix() {
    return Chat.createTextBuilder()
      .append('[').withColor(0x6)
      .append(this.scriptName).withColor(0xd)
      .append(']').withColor(0x6).append(' ').withColor(0xF)
  }

  /**
   * 
   * @param {*} msg 
   * @param {number | string | number[]} [color] 
   */
  log(msg, color) {
    msg = this.getPrefix().append(`${msg}`)
    if (color != null) {
      if (typeof color === 'string' && /^#?[\da-f]{6}$/i.test(color)) // '#FFFFFF'
        color = parseInt(color.slice(-6), 16)
      if (color === color & 0xF) msg.withColor(color) // 0xF
      else if (typeof color === 'number') // 0xFFFFFF
        msg.withColor((color >>> 16) & 0xFF, (color >>> 8) & 0xFF, color & 0xFF)
      else if (Array.isArray(color)) msg.withColor(...color) // [255, 255, 255]
    }
    Chat.log(msg.build())
  }

  /**
   * override it to use  
   * always add optional chaining, ex: `util.warn?.('warning')`
   * @type {((msg: string) => void)=}
   */
  warn = undefined

  /**
   * some debug util
   * @readonly
   */
  debug = {

    _monitorEnabled: false,

    /**
     * override it to use  
     * always add optional chaining, ex: `util.debug.log?.('test')`
     * @type {((msg: string) => void)=}
     */
    log: undefined,

    /**
     * monitor variables #TODO
     * @param {() => any[]} [watcher] 
     */
    monitor(watcher) {}

  }

  /**
   * since throw in async function is problematic  
   * will call {@link util.stopAll}
   * @returns {never}
   */
  throw(err) {
    try {
      if (err instanceof Java.type('java.lang.Throwable')) {
        const stackBuilder = Chat.createTextBuilder()
        let fullstack = ''
        let /** @type {Packages.java.lang.StackTraceElement} */ stack
        for (stack of err.getStackTrace()) {
          if (stack.getClassName().startsWith('com.oracle.truffle')) continue
          const call = `\n  at ${stack.getClassName()}.${stack.getMethodName()} `
          const location = `(${stack.getFileName()}:${stack.getLineNumber()})`
          fullstack += call + location
          stackBuilder
            .append(call).withColor(0xFF, 0x3F, 0x00)
            .append(location).withColor(0xFF, 0x7F, 0x00)
        }

        const name = err.getClass().getSimpleName()
        const msg = ': ' + err.getLocalizedMessage()
        fullstack = name + msg + fullstack

        Chat.log(
          this.getPrefix()
            .append(name)
            .withShowTextHover(Chat.createTextHelperFromString('Click to copy full stacktrace'))
            .withClickEvent('copy_to_clipboard', fullstack).withColor(0xFF, 0x3F, 0x00)
            .append(msg).withColor(0xFF, 0x3F, 0x00)
            .append(stackBuilder)
            .build()
        )
      } else {
        if (!(err instanceof Error)) err = new Error(err)
        const builder = this.getPrefix()
        const noOverloadRegex = /^TypeError: invokeMember \((\w+)\) on ([^@\s]+@[0-9a-f]+) failed due to: no applicable overload found \(overloads: \[/
        const errPathRegex = /(?<=^\s+at\s.*)(\(?[^\(\s]+:\d+:\d+\)?)$/gm
        let stack = err.stack
        const match = noOverloadRegex.exec(stack)
        if (match) { // messy parser
          const canAccept = {
            boolean: ['Boolean'],
            char:    ['Character'],
            String:  ['String'],
            byte:    ['Byte'],
            short:   ['Byte', 'Short'],
            int:     ['Byte', 'Short', 'Character', 'Integer'],
            long:    ['Byte', 'Short', 'Character', 'Integer', 'Long'],
            float:   ['Byte', 'Short', 'Character', 'Integer', 'Long', 'Float'],
            double:  ['Byte', 'Short', 'Character', 'Integer', 'Long', 'Float', 'Double']
          }
          const paramColors = {
            unknown:  0xf,
            match:    0xa,
            wrong:    0xc,
            notexist: 0x7
          }
          builder.append('TypeError: invokeMember').withColor(0xFF, 0x3F, 0x00)
            .withShowTextHover(Chat.createTextHelperFromString('Click to copy full stacktrace'))
            .withClickEvent('copy_to_clipboard', stack)
            .append(' (').withColor(0xFF, 0x3F, 0x00)
            .append(match[1]).withColor(0xd)
            .append(') on ').withColor(0xFF, 0x3F, 0x00)
            .append(match[2].match(/([^\.]+)@[0-9a-f]+/)[1]).withColor(0xd)
            .withShowTextHover(Chat.createTextHelperFromString(match[2]))
            .append(' failed due to:\n  no applicable overload found. overloads:')
            .withColor(0xFF, 0x3F, 0x00)
          stack = stack.slice(match[0].length)
          const methods = []
          while (stack[0] === 'M') { // overloads
            const methodMatch = stack.match(/^Method\[(?:public )?([^\]]+)\](?:, )?/)
            const typeMatch   = methodMatch[1].match(/^\S*?([^. ]+)(?= )/)
            const nameMatch   = methodMatch[1].match(/(?<=^\S+ ).*?([^\(\.]+)(?=\()/)
            const method = {prefix: undefined, params: [], rawParams: []}
            method.prefix = [typeMatch[1], typeMatch[0], nameMatch[1], nameMatch[0]]
            const params = methodMatch[0].slice(methodMatch[0].indexOf('(') + 1, methodMatch[0].lastIndexOf(')')).split(',')
            params.forEach((p, i) => {
              method.params.push(p.match(/[^\.]+$/)[0])
              method.rawParams.push(p)
            })
            stack = stack.slice(methodMatch[0].length)
            methods.push(method)
          }
          stack = ', ' + stack.slice('], arguments: ['.length)
          const args = {name: [], raw: []}
          let max = 100
          while (stack.startsWith(', ') && max-- > 0) { // arguments
            stack = stack.slice(2)
            const argMatch =
              stack.match(/^JavaObject\[.*?([^\.\(]+)\)\] \(HostObject\)(?=, |\]\))/) ||
              stack.match(/^com\.oracle\.truffle\.js\.runtime\.objects\.(.*?)\$DefaultLayout@[0-9a-z]{1,9} \(DefaultLayout\)(?=, |\]\))/) ||
              stack.match(/^.*?[\w\$]+ \((\w+)\)(?=, |\]\))/)
            args.name.push(argMatch[1] === 'TruffleString' ? 'String' : argMatch[1])
            args.raw .push(argMatch[0])
            stack = stack.slice(argMatch[0].length)
          }
          stack = stack.slice(2)
          methods.forEach(m => {
            builder.append('\n  ').append(m.prefix[0]).withColor(0xd)
            if (m.prefix[0] !== m.prefix[1])
              builder.withShowTextHover(Chat.createTextHelperFromString(m.prefix[1]))
                .withClickEvent('copy_to_clipboard', m.prefix[1])
            builder.append(' ').append(m.prefix[2]).withColor(0xd)
              .withShowTextHover(Chat.createTextHelperFromString(m.prefix[3]))
              .withClickEvent('copy_to_clipboard', m.prefix[3])
              .append('(')
            m.params.forEach((p, i) => {
              let color = paramColors.unknown
              if (!(i in args.name)) color = paramColors.notexist
              else if (p in canAccept)
                color = canAccept[p].includes(args.name[i]) ? paramColors.match : paramColors.wrong
              else if (m.rawParams[i].includes('.')) {
                if (args.raw[i].startsWith('JavaObject[')) try {
                  const paramClass = Reflection.getClass(m.rawParams[i])
                  const argClass = Reflection.getClass(args.raw[i].match(/\(([^\(]+)\)\] \(HostObject\)$/)[1])
                  color = paramClass.isAssignableFrom(argClass) ? paramColors.match : paramColors.wrong
                }catch (e) { // might not be a java class, who knows?
                  color = paramColors.wrong
                } else color = paramColors.wrong
              }

              builder.append(p).withColor(color)
              if (p !== m.rawParams[i])
                builder.withShowTextHover(Chat.createTextHelperFromString(m.rawParams[i]))
                  .withClickEvent('copy_to_clipboard', m.rawParams[i])
              if (i !== m.params.length - 1) builder.append(', ')
            })
            builder.append(') (').append(m.params.length)
              .withColor(m.params.length === args.name.length ? paramColors.match : paramColors.wrong)
              .append(')')
          })
          builder.append('\n  arguments:').withColor(0xFF, 0x3F, 0x00).append(' [')
          args.name.forEach((n, i) => {
            let name  = n
            let hover = args.raw[i]
            if (canAccept.double.includes(name)) {
              name = `${name} (${hover.match(/^\S+/)[0]})`
              hover = null
            } else if (name === 'Nullish') {
              name = hover.match(/^JS(\S+)/)[1]
              hover = null
            }
            builder.append(name).withColor(0xFF, 0x7F, 0x00)
            if (hover) builder.withShowTextHover(Chat.createTextHelperFromString(hover))
              .withClickEvent('copy_to_clipboard', args.raw[i])
            if (i !== args.name.length - 1) builder.append(', ')
          })
          builder.append(`] (${args.name.length})`)
          if (stack[0] !== '\n') builder.append(`\nparse error: not a new line: ${stack}`).withColor(0xc)
          else  stack.split(errPathRegex)
            .forEach((m, i) => builder.append(m).withColor(0xFF, i % 2 ? 0x7F : 0x3F, 0x00))
        } else {
          let name = stack.split(/\s/, 1)[0]
          builder.append(name)
            .withShowTextHover(Chat.createTextHelperFromString('Click to copy full stacktrace'))
            .withClickEvent('copy_to_clipboard', stack).withColor(0xFF, 0x3F, 0x00)
          stack = stack.slice(name.length)
          stack.split(errPathRegex)
            .forEach((m, i) => builder.append(m).withColor(0xFF, i % 2 ? 0x7F : 0x3F, 0x00))
        }
        Chat.log(builder.build())
      }
    } catch (e) {
      Chat.log(this.getPrefix().append(
        'An error accurred while parsing error!\n' +
        `The Error: ${err.stack ?? err}\n` +
        `Error while parsing: ${e.stack}`
      ).withColor(0xFF, 0x3F, 0x00).build())
    }
    this.stopAll()
  }

  /**
   * run {@link cb} in try catch and has util error stack parser
   * @param {() => Promise<*>} cb 
   * @param {boolean} stopWhenDone 
   */
  async run(cb, stopWhenDone = true) {
    try {
      await cb()
    }catch (e) {
      this.throw(e)
    }
    if (stopWhenDone) this.stopAll()
  }

  /**
   * able to look smoothly
   * @param {Pos3DLike} pos 
   * @param {() => boolean} [condition] will stop if match
   */
  async lookAt(pos, condition) {}

  /**
   * able to look smoothly
   * @param {number} yaw 
   * @param {number} pitch 
   * @param {() => boolean} [condition] will stop if match
   */
  async lookAt(yaw, pitch, condition) {}

  /**
   * able to look smoothly
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @param {() => boolean} [condition] will stop if match
   */
  async lookAt(x, y, z, condition) {
    if (typeof x === 'object') {
      condition = y
      ;({ x, y, z } = this.toPos(x))
    } else 

    if (typeof z === 'function') {
      condition = z
      z = undefined
    }

    if ((typeof x !== 'number') ||
        (typeof y !== 'number') ||
        (typeof z !== 'number') && z != null)
    this.throw(new TypeError(
      `expected (number, number, ?number), received (${typeof x}, ${typeof y}, ${typeof z})`
    ))

    const p = Player.getPlayer()
    if (!this.enableSmoothLook)
      return typeof z === 'number' ? p.lookAt(x, y, z) : p.lookAt(x, y)

    let yaw, pitch
    if (typeof z === 'number') {
      const vec = p.getPos().add(0, p.getEyeHeight(), 0).toReverseVector(x, y, z)
      yaw = vec.getYaw()
      pitch = vec.getPitch()
    } else {
      yaw = this.wrapYaw(x)
      pitch = Math.min(Math.max(-90, y), 90)
    }
    // x2: yaw, z2: pitch
    const delta = this.Vec(0, 0, 0,
      this.wrapYaw(yaw - p.getYaw()), 0,
      pitch - p.getPitch()
    )
    let rot = delta.getYaw() + (Math.random() - 0.5) * Math.min(delta.getMagnitude(), 10) * 6
    let d
    while (delta.getMagnitude() * 10 > this.lookMaxDegree && !condition?.()) {
      // calculate next rotation
      rot = rot + this.wrapYaw(delta.getYaw() - rot) * (0.5 + Math.random() * 0.2)
      // convert rot to yaw pitch, multiply them
      d = this.Pos(-Math.sin(rot * D2R), Math.cos(rot * D2R))
        .scale(Math.min(delta.getMagnitude() * 0.6, this.lookMaxDegree) * (0.8 + Math.random() * 0.2))
      p.lookAt(p.getYaw() + d.x, p.getPitch() + d.y)
      delta.x2 = this.wrapYaw(yaw - p.getYaw())
      delta.z2 = pitch - p.getPitch()
      await this.waitTick()
    }
    if (!condition?.()) p.lookAt(yaw, pitch)
  }

  wrapYaw(yaw) {
    return ((yaw + 180) % 360 - 360) % 360 + 180
  }

  getYawFromXZ(x = 0, z = 0) {
    return Player.getPlayer().getPos().toReverseVector(x, 0, z).getYaw()
  }

  /**
   * opens Survival Inventory regardless if there's any screen open  
   * only for information, not for interacting
   * @returns {InfoInventory}
   */
  openSurvivalInv() {
    return Inventory.create(new InvScreen(Player.getPlayer().getRaw()))
  }

  /**
   * @template {string} T
   * @param {T} id
   * @returns {T extends `${string}:${string}` ? T : `minecraft:${T}`}
   */
  completeId(id = 'air') {
    return id.includes(':') ? id : 'minecraft:' + id
  }

  completeIdKey(obj) {
    for (const k in obj) {
      if (k.includes(':')) continue
      obj['minecraft:' + k] = obj[k]
      delete obj[k]
    }
  }

  /**
   * get item from string
   * @param {string} data snbt or string id
   * @param {boolean} cache use cache or not
   * @returns {ItemStackHelper}
   */
  getItem(data, cache = true) {
    if (!cache) delete itemCache[data[0] !== '{' ? this.completeId(data) : data]
    if (data[0] !== '{') {
      return itemCache[this.completeId(data)] ??= new ItemStackHelper(
        ItemRegistry.method_10223(new Identifier(this.completeId(data))).method_7854())
        // ItemRegistry.get(id).getDefaultStack()
    } else return itemCache[data] ??= new ItemStackHelper(
      ItemStack.method_7915(StringNbtReader.method_10718(data))
      // ItemStack.fromNbt(StringNbtReader.parse())
    )
  }

  /**
   * returns max count of the item
   * @param {string} id 
   * @returns {number}
   */
  getMaxCount(id) {
    return ItemRegistry.method_10223(new Identifier(id)).method_7882()
    // ItemRegistry.get(id).getMaxCount()
  }

  /**
   * will recover on stop
   * @readonly
   */
  option = {

    /**
     * @readonly
     */
    original: {},

    /**
     * F3 + P
     * @param {boolean} bool 
     */
    setPauseOnLostFocus(bool = false) {
      // field_1837 = pauseOnLostFocus
      if (Client.getGameOptions().getRaw().field_1837 === !!bool) return
      if (!('pauseOnLostFocus' in this.original)) {
        this.original.pauseOnLostFocus = Client.getGameOptions().getRaw().field_1837
        util.stopListeners.push(() => 
          Client.getGameOptions().getRaw().field_1837 = this.original.pauseOnLostFocus
        )
      }
      Client.getGameOptions().getRaw().field_1837 = !!bool
    },

    setAutoJump(bool = true) {
      const AutoJump = Client.getGameOptions().getRaw().method_42423() // .getAutoJump()
      if (AutoJump.method_41753() === !!bool) return // .getValue()
      if (!('autoJump' in this.original)) {
        this.original.autoJump = AutoJump.method_41753() // .getValue()
        util.stopListeners.push(() => AutoJump.method_41748(this.original.autoJump)) // .setValue()
      }
      AutoJump.method_41748(!!bool)
    }

  }

  /**
   * dict operations
   * @readonly
   */
  dict = {

    /**
     * @template T
     * @param {T} obj 
     * @returns {T}
     */
    clone(obj) {
      const nobj = {}
      for (const k in obj) nobj[k] = obj[k]
      return nobj
    },

    /**
     * 
     * @param {object} obj 
     * @param {string[]} expected 
     * @param {object} bin 
     */
    cutExtra(obj, expected, bin = {}) {
      if (Object.keys(obj).every(k => expected.includes(k))) return null
      for (const k in obj) {
        if (expected.includes(k)) continue
        bin[k] = obj[k]
        delete obj[k]
      }
      return obj
    },

    add(obj, byobj) {
      for (const k in byobj) {
        obj[k] ??= 0
        obj[k] += byobj[k]
        if (!obj[k]) delete obj[k]
      }
      return obj
    },

    sub(obj, byobj) {
      for (const k in byobj) {
        obj[k] ??= 0
        obj[k] -= byobj[k]
        if (!obj[k]) delete obj[k]
      }
      return obj
    },

    mul(obj, multiplier = 1) {
      for (const k in obj) obj[k] *= multiplier
      return obj
    },

    div(obj, byobj) {
      let res = Infinity
      for (const k in byobj)
        if ((obj[k] ?? 0) / byobj[k] < res) res = (obj[k] ?? 0) / byobj[k]
      return res
    },

    mod(obj, byobj) {
      const times = Math.floor(this.div(obj, byobj))
      if (times > 0) for (const k in byobj) {
        obj[k] -= byobj[k] * times
        if (!obj[k]) delete obj[k]
      }
      return times
    },

    contains(obj, list = []) {
      return list.some(k => k in obj)
    },

    /**
     * 
     * @param {object} obj 
     * @param {boolean} removeEmpty 
     * @returns 
     */
    isEmpty(obj, removeEmpty = false) {
      if (removeEmpty)
      for (const key in obj) if (!obj[key]) delete obj[key]
      for (const key in obj) if (obj[key]) return false
      return true
    },

    isEqual(obj1, obj2) {
      const keys1 = Object.keys(obj1)
      const keys2 = Object.keys(obj2)
      if (keys1.length !== keys2.length) return false
      keys1.sort()
      keys2.sort()
      if (keys1.some((k, i) => k !== keys2[i] || obj1[k] !== obj2[k])) return false
      return true
    },

    isLessOrEqualThan(obj, than) {
      return Object.keys(obj).every(k => obj[k] <= (than[k] ?? 0))
    },

    fromInv() {
      const inv = util.openSurvivalInv()
      const res = {}
      Java.from(inv.getMap().main).concat(inv.getMap().hotbar).forEach(s => {
        const item = inv.getSlot(s)
        if (item.isEmpty()) return
        res[item.getItemId()] ??= 0
        res[item.getItemId()] += item.getCount()
      })
      return res
    }

  }

  /**
   * @readonly
   */
  math = {

    /**
     * 
     * @param {number} a 
     * @param {number} b 
     * @returns lowest common multiple
     */
    lcm(a = 0, b = 0) {
      a = this.primes(a)
      b = this.primes(b)
      for (const p in a) b[p] = Math.max(b[p] ?? 0, a[p])
      a = 1
      for (const p in b) a *= p ** b[p]
      return a
    },

    /**
     * 
     * @param {number} n 
     * @returns {{ [prime: number]: number }} primes
     */
    primes(n) {
      n = Math.floor(Math.abs(n))
      if (n === 1) return {}
      if (n === 2 || n === 3) return {[n]: 1}
      if (!(n > 0)) throw new Error(`can't find primes of ${n}`)
      const pri = {}
      if (!(n % 2)) {
        pri[2] = 0
        while (!(n % 2)) {
          pri[2]++
          n /= 2
        }
      }
      let t = 3
      while (t ** 2 <= n) {
        while (!(n % t)) {
          pri[t] ??= 0
          pri[t]++
          n /= t
        }
        t += 2
      }
      if (n > 1) {
        pri[n] ??= 0
        pri[n]++
      }
      return pri
    },

    clamp(x, min = 0, max = 1) {
      x = Math.min(Math.max(min, x), max)
      return isNaN(x) ? null : x
    },

    /**
     * 
     * @param {Pos3D[]} list 
     * @param {Pos3D | number[]} [pos] 
     * @returns {?Pos3D}
     */
    nearest(list, pos) {
      if (!pos) pos = Player.getPlayer().getPos()
      else pos = util.toPos(pos)
      let dist = Infinity
      let res  = null
      list.forEach(p => {
        const distance = pos.toVector(p).getMagnitudeSq()
        if (distance < dist) {
          dist = distance
          res = p
        }
      })
      return res
    },

    /**
     * convert the vec to positive, will call {@link util.toVec}
     * @param {Vec3D} vec 
     * @returns {Vec3D}
     */
    toPositiveVec(vec) {
      vec = util.toVec(vec)
      let temp
      if (vec.x1 > vec.x2) {
        temp   = vec.x1
        vec.x1 = vec.x2
        vec.x2 = temp
      }
      if (vec.y1 > vec.y2) {
        temp   = vec.y1
        vec.y1 = vec.y2
        vec.y2 = temp
      }
      if (vec.z1 > vec.z2) {
        temp   = vec.z1
        vec.z1 = vec.z2
        vec.z2 = temp
      }
      return vec
    },

    /**
     * @template {Pos2D | Pos3D} T
     * @param {T} pos1 
     * @param {T} pos2
     * @returns {boolean} 
     */
    posEquals(pos1, pos2) {
      if ('x' in pos1) {
        if (pos1.x !== pos2.x || pos1.y !== pos2.y) return false
        if ('z' in pos1 && pos1.z !== pos2.z) return false
      } else util.throw(`not pos (${pos1})`)
      return true
    }

  }

  /**
   * @type {(text: string) => number}
   */
  getTextWidth = Client.getMinecraft().field_1772.method_1727 // .textRenderer.getWidth

  /**
   * @type {(packet: object) => void}
   */
  sendPacket = Client.getMinecraft().method_1562().method_2883

}

const util = new Util

/** @type {IEventListener[]} */
const listeners = []

/**
 * waitForEventListeners
 * @template {keyof Events} E
 * @type {{ [event: E]: {
 *  listener: IEventListener,
 *  cbs: {
 *    res(): void,
 *    cancel?: boolean,
 *    condition?: EventCallback<E, boolean>,
 *    callback?:  EventCallback<E>
 *  }[]
 * } }}
 */
const wfeListeners = {}

util.on('Tick', () => {
  tickClock++
  // basically won't miss but just in case
  if (!(tickClock & 7)) Object.keys(tickQueue).forEach(k => {
    if (+k > tickClock) return
    if (Array.isArray(tickQueue[k])) tickQueue[k].forEach(r => r())
    else tickQueue[k]()
    delete tickQueue[k]
  })
  else if (tickQueue[tickClock]) {
    if (Array.isArray(tickQueue[tickClock])) tickQueue[tickClock].forEach(r => r())
    else tickQueue[tickClock]()
    delete tickQueue[tickClock]
  }
})

module.exports = util
