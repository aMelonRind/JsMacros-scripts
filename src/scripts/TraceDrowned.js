// @ts-check
// draw lines to drowned
// if notify is true, play trident return sound and request attention when found a drowned with trident
// and play trident channeling sound when a trident item is dropped

const notify = true

const DrownedEntityHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.world.entity.specialized.mob.DrownedEntityHelper')
const requestAttention = notify ? require('../lib/GLFW').requestAttention : null

require('../lib/SimpleTraceEntity').trace(0, function (e) {
  if (e instanceof DrownedEntityHelper) {
    if (e.hasTrident()) {
      if (notify) { // && Player.getPlayer().getPos().toVector(e.getPos()).getMagnitude() < 56
        World.playSound('minecraft:item.trident.return', 2)
        requestAttention?.()
      }
      this.builder.color(0xFFFF00)
    } else this.builder.color(0x00FFFF)
    return true
  } else if (e.getType() === 'minecraft:item' && e.asItem().getContainedItemStack().getItemId() === 'minecraft:trident') {
    e.setGlowing(true).setGlowingColor(0xFFFF00)
    if (notify) World.playSound('minecraft:item.trident.thunder', 1, 1, e.getX(), e.getY(), e.getZ())
  }
}).registerStopListener().enableDimensionClear()
