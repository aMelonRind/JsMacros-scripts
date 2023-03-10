
/**
 * just put require('./lib/DuplicateCheck') at the very start to prevent duplicates
 * append .setOnDuplicate(q => q()) to make a toggle script
 */

const scriptPath = context.getCtx().getFile().getPath()

let shouldStart = false
const prev = GlobalVars.getObject(`MelonRind:DuplicateChecker:script<${scriptPath}>`)
if (!prev) shouldStart = true
else try {
  if (!prev[0]) shouldStart = true
}catch (e) {
  shouldStart = true
}

if (!shouldStart) { // previous one is running
  try {
    prev[0].onDuplicate?.(quit)
    if (++prev[0].count >= 5)
      if (prev[0].count >= 8) {
        prev[0].context.getCtx().closeContext()
        Chat.log(`[Duplicate] killed previous context. (${scriptPath.match(/[^\\]+$/)[0]})`)
      }else {
        const times = 8 - prev[0].count
        Chat.log(
          `§c[Duplicate] previous context is still running! (${scriptPath.match(/[^\\]+$/)[0]})\n` +
          `  press ${times} more time${times === 1 ? '' : 's'} to kill it.`
        )
      }
  }catch (e) {
    if (!e?.message?.includes('was closed')) throw e
  }
  quit()
}

const status = {
  onDuplicate: null,
  context,
  count: 0
}

GlobalVars.putObject(`MelonRind:DuplicateChecker:script<${scriptPath}>`, Java.to([status]))

/**
 * will halt the script and quit in 3 seconds  
 * without any message
 */
function quit() {
  const e = JsMacros.createCustomEvent('e')
  e.putObject('ctx', context)
  JsMacros.runScript('js', `
    const history = Chat.getHistory()
    const del = [
      'Thread was interrupted.',
      'Context execution was cancelled.',
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

module.exports = {

  /**
   * will call when duplicate happens
   * @param {(quit: () => never) => void} listener
   * @default undefined
   * @returns self
   */
  setOnDuplicate(listener) {
    status.onDuplicate = (typeof listener === 'function') ? listener : null
    return this
  }

}