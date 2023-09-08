
class SmartWrapper {

  /**
   * @template T
   * @template U
   * @template R
   * @param {((arg0: T, arg1: U) => R) | MethodWrapper<T, U, R>} fn 
   * @returns {MethodWrapper<T, U, R>}
   */
  static warp(fn) {
    return (typeof fn === 'function' && !Java.isJavaObject(fn)) ? JavaWrapper.methodToJavaAsync(fn) : fn
  }

}

module.exports = SmartWrapper
