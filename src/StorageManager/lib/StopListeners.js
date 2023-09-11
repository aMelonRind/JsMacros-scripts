// @ts-check
// JsMacros.assertEvent(event, 'Service')

/** @type {Map<number, (() => any)[]>} */ const listeners = new Map()
event.stopListener = JavaWrapper.methodToJava(() => {
  [...listeners.keys()].sort((a, b) => b - a).forEach(k => {
    listeners.get(k)?.forEach(fn => {
      try {
        fn()
      } catch (e) {}
    })
  })
})

class StopListeners {

  /**
   * @param {() => any} fn 
   * @param {number} priority
   */
  static add(fn, priority = 0) {
    listeners.set(priority, (listeners.get(priority) ?? []).concat(fn))
  }

}

module.exports = StopListeners
