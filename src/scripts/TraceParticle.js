
// can draw lines from crosshair to particles (damage particle in this script)
JsMacros.assertEvent(event, 'Service')

// field_17832	NO_RENDER
// field_17831	CUSTOM
// field_17830	PARTICLE_SHEET_LIT
// field_17829	PARTICLE_SHEET_TRANSLUCENT
// field_17828	PARTICLE_SHEET_OPAQUE
// field_17827	TERRAIN_SHEET
const pSheet = Java.type('net.minecraft.class_3999').field_17828
const Particle = Java.type('net.minecraft.class_703')
const DamageParticle = Java.type('net.minecraft.class_657')
const ParticleManager = Client.getMinecraft().field_1713
const particlesF = Java.type('net.minecraft.class_702').class.getDeclaredField('field_3830')
particlesF.setAccessible(true)

const ageF = Particle.class.getDeclaredField('field_3866')
ageF.setAccessible(true)

const xF = Particle.class.getDeclaredField('field_3874')
const yF = Particle.class.getDeclaredField('field_3854')
const zF = Particle.class.getDeclaredField('field_3871')
xF.setAccessible(true)
yF.setAccessible(true)
zF.setAccessible(true)

const d3d = Hud.createDraw3D().register()
/** @type {Map<Particle, TraceLine>} */
const particles = new Map()

JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
  for (const p of particles.keys()) {
    const line = particles.get(p)
    if (!line) {
      particles.delete(p)
      continue
    }
    if (!p.method_3086()) { // .isAlive()
      d3d.removeTraceLine(line)
      particles.delete(p)
      continue
    }
    line.setPos(xF.get(p), yF.get(p), zF.get(p))
  }
  /** @type {JavaArray<*>} */
  const pArr = particlesF.get(ParticleManager)?.get(pSheet)?.toArray()
  pArr?.forEach((p, i) => {
    if (i > 4096) p.method_3085() // .markDead()
    if (ageF.get(p) > 1) return // sometimes is 0, sometimes is 1
    if (!(p instanceof DamageParticle)) return
    if (particles.has(p)) return
    particles.set(p, d3d.addTraceLine(xF.get(p), yF.get(p), zF.get(p), 0xFFEE00))
  })
}))

event.stopListener = JavaWrapper.methodToJava(() => d3d.unregister())

module.exports = {}
