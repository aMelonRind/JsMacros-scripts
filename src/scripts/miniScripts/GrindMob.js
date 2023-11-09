
JsMacros.assertEvent(event, 'Service')
module.exports = 0

/** @type {(EntityId extends `minecraft:${infer I}` ? I : never)[]} */
const mobTypes = [
  'wither_skeleton', 'blaze', 'ghast', 'zombified_piglin',
  'zombie', 'creeper', 'skeleton', 'witch', 'spider', 'cave_spider', 'chicken',
  'enderman'
]

const _mobTypes = mobTypes.map(id => 'minecraft:' + id)

JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
  if (Player.getPlayer().getRaw().method_7261(0.0) < 1) return // .getAttackCooldownProgress(baseTime)
  const im = Player.getInteractionManager()
  const trace = im.getTargetedEntity()
  if (!trace || !_mobTypes.includes(trace.getType())) return
  im.attack(trace)
}))
