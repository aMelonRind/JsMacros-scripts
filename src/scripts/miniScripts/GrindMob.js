
const mobTypes = [
  'wither_skeleton', 'blaze', 'ghast', 'zombified_piglin',
  'zombie', 'creeper', 'skeleton', 'witch', 'spider', 'cave_spider', 'chicken',
  'enderman'
].map(id => 'minecraft:' + id)

JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
  if (Player.getPlayer().getRaw().method_7261(0.0) < 1) return // .getAttackCooldownProgress(baseTime)
  const trace = Player.rayTraceEntity()
  if (!trace || !mobTypes.includes(trace.getType())) return
  Player.getPlayer().attack(trace)
}))
