
// draw lines to drowned
// if notify is true, play trident return sound and request attention when found a drowned with trident
// and play trident channeling sound when a trident item is dropped
// is service

const notify = true

const { newLine, traceEntityBuilder } = require('../lib/TraceLine')
const { requestAttention } = require('../lib/GLFW')

if (World.isWorldLoaded()) Java.from(World.getEntities()).forEach(check)

JsMacros.on('EntityLoad', JavaWrapper.methodToJava(e => check(e.entity)))

/** @param {EntityHelper} e */
function check(e) {
  if (e.getType() === 'minecraft:drowned') {
    if (e.getMainHand().getItemId() === 'minecraft:trident'
    ||  e.getOffHand().getItemId() === 'minecraft:trident'
    ) {
      if (notify) {
        World.playSound('minecraft:item.trident.return', 2)
        requestAttention()
      }
      newLine(0xFFFF00, traceEntityBuilder(e))
    } else newLine(0x00FFFF, traceEntityBuilder(e))
  } else if (e.getType() === 'minecraft:item'
  && e.asItem().getContainedItemStack().getItemId() === 'minecraft:trident'
  // && e.getRaw().method_18798().field_1351 === 0.2 // .getVelocity().y
  ) {
    // Chat.log(`VelocityY: ${e.getRaw().method_18798().field_1351}`)
    e.setGlowing(true).setGlowingColor(0xFFFF00)
    if (notify) World.playSound('minecraft:item.trident.thunder', 1, 1, e.getX(), e.getY(), e.getZ())
  }
}
