
// for not enough crashes mod
// is service

JsMacros.on('OpenScreen', JavaWrapper.methodToJava(e => {
  if (e.screenName === 'unknown' && e.screen.getScreenClassName() === 'CrashScreen') {
    e.screen.close()
    Chat.log('Not Enough Crashes Screen Closed')
  }
}))
