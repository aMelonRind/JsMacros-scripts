
// util.storage.shulkerMachine

/**
 * @param {import('../util')} util
 * @returns {ShulkerMachineHandler}
 */
module.exports = util => {
  /** @typedef {_&modu} ShulkerMachineHandler */
  if (!util?.toJava) throw new Error('util needed')

  const modu = {
    notImplemented: true
  }

  return modu
}
