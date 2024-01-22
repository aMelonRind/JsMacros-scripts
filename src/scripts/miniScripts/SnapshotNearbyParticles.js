//@ts-check
// can count and log nearby particles to the chat.
JsMacros.assertEvent(event, 'Key')
module.exports = 0

const Particle = Java.type('net.minecraft.class_703')
const Sheets = Java.type('net.minecraft.class_3999')
const particleManager = Client.getMinecraft().field_1713
const particlesF = Java.type('net.minecraft.class_702').class.getDeclaredField('field_3830')
particlesF.setAccessible(true)

const xF = Particle.class.getDeclaredField('field_3874')
const yF = Particle.class.getDeclaredField('field_3854')
const zF = Particle.class.getDeclaredField('field_3871')
xF.setAccessible(true)
yF.setAccessible(true)
zF.setAccessible(true)

/** @type {JavaMap<any, JavaSet<any>>} */
const particles = particlesF.get(particleManager)

// field_17832	NO_RENDER
// field_17831	CUSTOM
// field_17830	PARTICLE_SHEET_LIT
// field_17829	PARTICLE_SHEET_TRANSLUCENT
// field_17828	PARTICLE_SHEET_OPAQUE
// field_17827	TERRAIN_SHEET
for (const sheetf of ['field_17830', 'field_17829', 'field_17828', 'field_17827']) {
  const pSheet = Sheets[sheetf]
  const pArr = particles.get(pSheet)?.toArray()
  const p = Player.getPlayer()
  const res = {}
  pArr?.forEach((pa, i) => {
    if (p.distanceTo(xF.get(pa), yF.get(pa), zF.get(pa)) < 1.5) {
      const name = pa.getClass().getSimpleName()
      res[name] ??= 0
      res[name]++
    }
  })
  for (const _ in res) {
    Chat.log(`${sheetf}:`)
    Chat.log(res)
    break
  }
}
