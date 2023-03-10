
// can draw lines from crosshair to mob
// is service

const { newLine, traceEntityBuilder } = require('./lib/TraceLine')

if (World.isWorldLoaded()) Java.from(World.getEntities()).forEach(check)

JsMacros.on('EntityLoad', JavaWrapper.methodToJava(e => check(e.entity)))

function check(e) {
  // if (Player.getPlayer().getRaw().equals(e.getRaw())) return
  if (!e.getType().endsWith(':sheep')) return
  newLine(0x00FFFF, traceEntityBuilder(e))
}
