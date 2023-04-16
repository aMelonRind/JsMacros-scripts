
/**
 * just put require('./lib/DuplicateCheck') at the very beginning to prevent duplicates
 */

const scriptPath = context.getCtx().getFile().getPath()

const Enum = {
  status: 0,
  count: 1
}

let shouldStart = false
const prev = GlobalVars.getObject(`MelonRind:DuplicateChecker:script<${scriptPath}>`)
if (!prev) shouldStart = true
else try {
  if (!prev[Enum.status]) shouldStart = true
}catch (e) {
  shouldStart = true
}

if (!shouldStart) { // previous one is running
  try {
    if (++prev[Enum.count] >= 5)
      if (prev[Enum.count] >= 8) {
        prev[Enum.status].context.getCtx().closeContext()
        Chat.log(`[Duplicate] killed previous context. (${scriptPath.match(/[^\\]+$/)[0]})`)
      }else {
        const times = 8 - prev[Enum.count]
        Chat.log(
          `§c[Duplicate] previous context is still running! (${scriptPath.match(/[^\\]+$/)[0]})\n` +
          `  press ${times} more time${times === 1 ? '' : 's'} to kill it.`
        )
      }
  }catch (e) {
    throw e
  }
  quit()
}

const status = Java.to([
  {context},
  0
])

GlobalVars.putObject(`MelonRind:DuplicateChecker:script<${scriptPath}>`, status)

/**
 * will halt the script and quit in 3 seconds  
 * without any message (95% works i guess)
 */
function quit() {
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
        Packages.xyz.wagyourtail.jsmacros.client.api.classes.Draw2D)
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
    null, e, JavaWrapper.methodToJava(e => Chat.log(e))
  )
  while (true) Client.waitTick()
}
