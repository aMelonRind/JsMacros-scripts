//@ts-check
class Logger {
  /** @readonly @type {TextHelper} */ prefix
  /** @readonly @type {Packages.org.slf4j.Logger} */ internalLogger

  /** @type {((msg: any) => void)?} */ debug = null

  constructor () {
    let name = file.getName()
    const index = name.lastIndexOf('.')
    if (index !== -1) name = name.slice(0, index)
    this.internalLogger = Chat.getLogger(name)
    this.prefix = Chat.createTextBuilder()
      .append('[').withColor(0x6)
      .append(name).withColor(0xd)
      .append(']').withColor(0x6).append('').withColor(0xF)
      .build()
  }

  wrap(msg, separator = ' ') {
    return Chat.createTextBuilder().append(this.prefix).append(separator).append(msg).build()
  }

  actionbar(msg) {
    Chat.actionbar(this.wrap(msg))
  }

  log(msg) {
    const text = this.wrap(msg)
    Chat.log(text)
    this.internalLogger.info(text.getString())
  }

  #debug(msg) {
    const text = this.wrap(msg, '[debug] ')
    Chat.log(text)
    this.internalLogger.debug(text.getString())
  }

  /**
   * @param {boolean} enable 
   */
  setDebug(enable) {
    this.debug = enable ? this.#debug : null
  }

}

const logger = new Logger()

module.exports = logger
