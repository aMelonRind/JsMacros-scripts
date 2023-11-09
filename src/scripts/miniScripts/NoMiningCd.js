// removes mining cd for blocks that needs more than 1 tick to destroy
JsMacros.assertEvent(event, 'Service')
module.exports = 0

const cdf = Reflection.getDeclaredField(im.getClass(), 'field_3716')
cdf.setAccessible(true)

let im = Player.getInteractionManager()?.getRaw()

JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
  if (im) cdf.set(im, 0)
}))

JsMacros.on('DimensionChange', JavaWrapper.methodToJava(() => {
  im = Player.getInteractionManager()?.getRaw() ?? im
}))
