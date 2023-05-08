
// consume firework for power flight when clicked on a block and is fallflying
// is service

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')
const mc = Client.getMinecraft()
const interactItem = mc.field_1761.method_2919
// .interactionManager.interactItem(player, hand)
const Hand = Java.type('net.minecraft.class_1268')
const MAIN_HAND = Hand.field_5808
const OFF_HAND = Hand.field_5810

/*
JsMacros.on('InteractBlock', JavaWrapper.methodToJava(() => {
  const p = Player.getPlayer()
  if (!p.isFallFlying()) return
  const mainHand = p.getMainHand().getItemId() === 'minecraft:firework_rocket'
  if (!mainHand && p.getOffHand().getItemId() !== 'minecraft:firework_rocket') return
  mc.field_1761.method_2919(p.getRaw(), mainHand ? MAIN_HAND : OFF_HAND)
  // mc.field_1761.method_2919(p.getRaw(), mc.field_1687, mainHand ? MAIN_HAND : OFF_HAND) // 1.18.2
  // .interactionManager.interactItem(player, hand)
}))
*/

JsMacros.on('Key', JavaWrapper.methodToJava(e => {
  if (e.action !== 1 || e.key !== KeyBind.getKeyBindings()['key.use']) return
  const p = Player.getPlayer()
  if (!p.isFallFlying() || !Player.rayTraceBlock(6, false)) return
  const mainHand = p.getMainHand().getItemId() === 'minecraft:firework_rocket'
  if (!mainHand && p.getOffHand().getItemId() !== 'minecraft:firework_rocket') return
  interactItem(p.getRaw(), mainHand ? MAIN_HAND : OFF_HAND)
}))

module.exports = {}
