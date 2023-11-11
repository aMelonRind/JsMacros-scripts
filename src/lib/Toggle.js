//@ts-check
const path = file.getPath()
const keySession = path + ':toggle:session'
const keyStopRequest = path + ':toggle:stopRequests'

const contexts = Java.from(JsMacros.getOpenContexts()).filter(c => c.getFile()?.getPath() === path && c !== context.getCtx())

class Toggle {

  /**
   * check if the script should be active
   */
  check() { return false }

  /**
   * same as Client.waitTick(ticks), but short circuits when check() is false 
   * @param {int} ticks 
   * @param {(() => any)?} [stopCondition]
   * @param {(() => any)?} [stopConditionOnSec]
   */
  checkWhileWait(ticks, stopCondition, stopConditionOnSec) {
    while (ticks-- > 0
      && this.check()
      && !stopCondition?.()
      && !(stopConditionOnSec && !(ticks % 20) && stopConditionOnSec?.())
    ) Client.waitTick()
    return this.check()
  }

  /**
   * a basic while loop with interval
   * @param {() => any} cb if it returns non-undefined value, the loop will break.
   *  then if the value is not null, will log the value
   * @param {int} interval interval in ticks.
   *  setting to non-positive number will assume you have wait function in the callback
   */
  basicLoop(cb, interval = 1) {
    if (!this.check()) return
    const logger = require('./Logger')
    logger.log('started')

    let value = undefined
    interval = Math.ceil(interval)
    if (interval < 1) {
      while (this.check()) if ((value = cb()) !== undefined) break
    } else while (this.check()) {
      if ((value = cb()) !== undefined) break
      this.checkWhileWait(interval)
    }
    if (value != null) logger.log(value)

    logger.log('stopped')
  }

}

const toggle = new Toggle()

if (contexts.length === 0) {
  GlobalVars.putInt(keyStopRequest, 0)
  const session = GlobalVars.incrementAndGetInt(keySession)
  if (session === null) throw new TypeError('The session key is occupied by something else!')
  toggle.check = function check() {
    return GlobalVars.getInt(keySession) === session && !GlobalVars.getInt(keyStopRequest)
  }
} else {
  const stopRequests = GlobalVars.incrementAndGetInt(keyStopRequest)
  if (stopRequests === null) throw new TypeError('The stopRequests key is occupied by something else!')
  if (stopRequests > 1) {
    const logger = require('./Logger')
    if (stopRequests === 2) {
      logger.log(`There's ${contexts.length} open context${contexts.length === 1 ? '' : 's'}!`)
      logger.log(`Click again to attempt to forcefully close them. Might cause unexpected behavior!`)
    } else {
      for (const context of contexts) context.closeContext()
      logger.log(`Closed ${contexts.length} contexts.`)
      GlobalVars.putInt(keyStopRequest, 1)
    }
  }
}

module.exports = toggle
