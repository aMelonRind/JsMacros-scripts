
// consume firework for power flight when clicked on a block and is fallflying
JsMacros.assertEvent(event, 'Service')

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')

JsMacros.on('InteractBlock', JavaWrapper.methodToJava(() => {
  const p = Player.getPlayer()
  if (!p.isFallFlying() || !p.isHolding('minecraft:firework_rocket')) return
  Player.getInteractionManager().interactItem(p.getMainHand().getItemId() !== 'minecraft:firework_rocket')
}))
