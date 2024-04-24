//@ts-check
// removes mining cd for blocks that needs more than 1 tick to destroy
// reduce use cd from 4 to 2 ticks
// reduce jump cd from 10 to 5 ticks
JsMacros.assertEvent(event, 'Service')
module.exports = 0

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')

const mc = Client.getMinecraft()
let im = Player.getInteractionManager()?.getRaw()
let p = Player.getPlayer()?.getRaw()

const bcdf = Reflection.getDeclaredField(im.getClass(), 'field_3716')
bcdf.setAccessible(true)

const icdf = Reflection.getDeclaredField(mc.getClass(), 'field_1752')
icdf.setAccessible(true)

const jcdf = Reflection.getDeclaredField(Java.type('net.minecraft.class_1309'), 'field_6228')
jcdf.setAccessible(true)

JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
  if (im) bcdf.set(im, 0)
  if (p && jcdf.get(p) > 5) jcdf.set(p, 5)
  if (icdf.get(mc) > 2) icdf.set(mc, 2)
}))

JsMacros.on('DimensionChange', JavaWrapper.methodToJava(() => {
  im = Player.getInteractionManager()?.getRaw() ?? im
  p = Player.getPlayer()?.getRaw() ?? p
}))
