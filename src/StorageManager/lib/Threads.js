// @ts-check

const StopListeners = require('./StopListeners')

const syncObjectF = Java.type('xyz.wagyourtail.jsmacros.core.MethodWrapper').class.getDeclaredField('syncObject')
syncObjectF.setAccessible(true)

class Threads {
  /** @private @readonly @type {Set<*>} */
  static syncObjects = new Set()
  /** @private @readonly @type {MethodWrapper[]} */
  static wrappers = []

  static {
    StopListeners.add(() => this.cleanWrapper(), -10)
  }

  /**
   * wraps the callback on another context, then resolve the wrapped method  
   * use `Threads.cleanWrapper()` to clean the contexts created this way.
   * @template T
   * @template U
   * @template R
   * @param {(arg0: T, arg1: U) => R} fn 
   * @param {Record<string, object>} [variables] 
   * @returns {Promise<MethodWrapper<T, U, R>>}
   */
  static wrapCallback(fn, variables) {
    if (typeof fn !== 'function' || Java.isJavaObject(fn)) throw new Error('This method can only wrap js function!')
    const event = JsMacros.createCustomEvent('wrapCallback')
    return new Promise(res => {
      JsMacros.runScript('js', `
        ${this.toHeader(event, variables)}
        event.putObject('wrapped', JavaWrapper.methodToJava(${this.fnToString(fn)}));
      `, null, event, JavaWrapper.methodToJava(t => {
        if (t) throw t
        this.wrappers.push(event.getObject('wrapped'))
        this.escapeThread().then(() => {
          res(event.getObject('wrapped'))
        })
      })
      )
    })
  }

  /**
   * runs the script on another context, then resolve the module.exports  
   * use `Threads.clearSyncObjects()` to clean the contexts created this way.
   * @param {string} path absolute path please
   * @returns {Promise<any>}
   */
  static runScript(path) {
    if (typeof path !== 'string' || !path.endsWith('.js') || !FS.isFile(path)) throw new Error('This method can only wrap file!')
    const event = JsMacros.createCustomEvent('wrapScript')
    return new Promise(res => {
      this.syncObjects.add(JsMacros.runScript('js', `
        ${FS.open(path).read()};
        event.putObject('wrapped', module.exports);
      `, null, event, JavaWrapper.methodToJava(t => {
        if (t) throw t
        this.escapeThread().then(() => res(event.getObject('wrapped')))
      })).getCtx().getSyncObject())
    })
  }

  /**
   * runs the script callback, then resolve the module.exports  
   * use `Threads.clearSyncObjects()` to clean the contexts created this way.
   * @param {() => any} script 
   * @param {Record<string, object>} [variables] 
   */
  static run(script, variables) {
    const event = JsMacros.createCustomEvent('wrapScript')
    return new Promise(res => {
      this.syncObjects.add(JsMacros.runScript('js', `
        ${this.toHeader(event, variables)}
        ;(${this.fnToString(script)})();
        event.putObject('wrapped', module.exports);
      `, null, event, JavaWrapper.methodToJava(t => {
        if (t) throw t
        this.escapeThread().then(() => res(event.getObject('wrapped')))
      })).getCtx().getSyncObject())
    })
  }

  static cleanWrapper() {
    this.wrappers.splice(0, Infinity).forEach(w => this.unsyncWrapper(w))
  }

  /**
   * @param {MethodWrapper} wrapper 
   */
  static unsyncWrapper(wrapper) {
    try {
      syncObjectF.set(wrapper, null)
    } catch (e) {}
  }

  static clearSyncObjects() {
    this.syncObjects.clear()
  }

  /**
   * Cleans both wrappers and syncObjects
   */
  static clean() {
    this.cleanWrapper()
    this.clearSyncObjects()
  }

  /**
   * @returns {Promise<void>}
   */
  static escapeThread() {
    return new Promise(res => JavaWrapper.methodToJavaAsync(() => res(void 0)).run())
  }

  /**
   * @param {Events.Custom} event
   * @param {Record<string, object>} [variables] 
   */
  static toHeader(event, variables) {
    if (!variables) return ''
    return Object.keys(variables).map(k => {
      if (!/^[\w_$]+$/.test(k)) return ''
      event.putObject(k, variables[k])
      return `const ${k} = event.getObject(\`${k.replaceAll('`', '\`')}\`);\n`
    }).join('')
  }

  /**
   * @param {(...args: any[]) => any} fn 
   */
  static fnToString(fn) {
    let str = fn.toString()
    let isAsync = false
    if (str.startsWith('async ')) {
      isAsync = true
      str = str.slice(6)
    }
    return (isAsync ? 'async ' : '') + ((str.startsWith('(') || str.startsWith('function ') || /^\s*\w+\s*=>/.test(str)) ? str : 'function ' + str)
  }

}

module.exports = Threads
