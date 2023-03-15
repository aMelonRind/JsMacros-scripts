
// util.container.shulkerMacro

/**
 * @param {import('../util')} util
 * @returns {ShulkerMacroHandler}
 */
module.exports = util => {
  /** @typedef {_&modu} ShulkerMacroHandler */
  if (!util?.toJava) throw new Error('util needed')

  const modu = {
    notImplemented: true
  }

  return modu
}
