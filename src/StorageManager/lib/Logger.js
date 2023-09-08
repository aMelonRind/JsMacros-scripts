
const Throwable = Java.type('java.lang.Throwable')

class Logger {

  /**
   * @type {string}
   * @readonly
   * @private
   */
  name

  constructor (name) {
    this.name = `${name}`
  }

  /**
   * @param {string} text 
   * @param {number} color 
   */
  getPrefix(text, color = 0xd, bracketColor = 0x6) {
    return Chat.createTextBuilder()
      .append('[').withColor(bracketColor)
      .append(text).withColor(color)
      .append(']').withColor(bracketColor).append(' ').withColor(0xF)
  }

  /**
   * @param {string | TextHelper | TextBuilder} msg 
   */
  log(msg) {
    msg = this.getPrefix(this.name).append(msg).build()
    Chat.log(msg)
    console.log('[JsMacros] ' + msg.getString())
  }

  /**
   * @param {string | TextHelper | TextBuilder} msg 
   * @param {Error | Throwable | string} [err]
   */
  warn(msg, err) {
    this.log(this.getPrefix('Warn', 0x6, 0xf).append(msg).append(err ? this.formatErr(err) : '').withColor(0xc))
  }

  /**
   * set debug state
   * @param {boolean} enabled 
   */
  setDebug(enabled = false) {
    if (enabled) this.debug = this._debug
    else delete this.debug
  }

  /**
   * @param {boolean | number | string | TextHelper | TextBuilder} msg 
   * @private
   */
  _debug(msg) {
    this.log(this.getPrefix('Debug', 0xa, 0xf).append(msg))
  }

  /** @type {((msg: boolean | number | string | TextHelper | TextBuilder) => void)?} */ debug

  /**
   * @param {Error | Throwable | string} err 
   * @returns {string}
   */
  formatErr(err) {
    if (err instanceof Error) return `${err.message}\n${err.stack ?? ''}`
    else if (err instanceof Throwable) {
      let fullstack = ''
      let /** @type {Packages.java.lang.StackTraceElement} */ stack
      for (stack of err.getStackTrace()) {
        if (stack.getClassName().startsWith('com.oracle.truffle')) continue
        const call = `\n  at ${stack.getClassName()}.${stack.getMethodName()} `
        const location = `(${stack.getFileName()}:${stack.getLineNumber()})`
        fullstack += call + location
      }

      const name = err.getClass().getSimpleName()
      const msg = ': ' + err.getLocalizedMessage()
      return name + msg + fullstack
    } else return `${err}`
  }

}

module.exports = Logger

/**
 * @typedef {Packages.java.lang.Throwable} Throwable
 */
