
/**
 * @typedef {{
 *  x: number
 *  y: number
 *  z: number
 *  color: number
 *  remove: boolean
 *  onTick?: (line: TraceLine) => void
 *  onFrame?: (line: TraceLine) => void
 *  line: Draw3D$Line
 * }} TraceLine
 */

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')

let tickListener
/** @type {TraceLine[]} */
let lines = []

/** @type {Draw3D} */
const d3d = Reflection.createClassProxyBuilder(Java.type('xyz.wagyourtail.jsmacros.client.api.classes.Draw3D'))
            .addMethod('render', JavaWrapper.methodToJava((ref, args) => {
  cachePoint = undefined
  if (!lines[0]) return ref.parent(args) // super
  getStartingPoint()
  lines.forEach(l => {
    if (l.remove) return d3d.removeLine(l.line)
    l.onFrame?.(l)
    if (l.remove) return d3d.removeLine(l.line)
    l.line.setPos(...cachePoint, l.x, l.y, l.z)
  })
  lines = lines.filter(l => !l.remove)
  if (!lines[0]) return ref.parent(args) // super
  ref.parent(args) // super
})).buildInstance([])
d3d.register()

/**
 * 
 * @param {number} color 
 * @param {(line: TraceLine) => void} [onTick] will run extra once on creation, won't have line property on first call
 * @param {(line: TraceLine) => void} [onFrame] 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @returns {TraceLine}
 */
function newLine(color = 0xFFFFFF, onTick, onFrame, x = 0, y = 0, z = 0) {
  const obj = {
    onTick,
    onFrame,
    x, y, z,
    remove: false,
  }
  obj.onTick?.(obj)
  if (obj.remove) return null

  obj.line = d3d.addLine(0, 0, 0, 0, 0, 0, color)
  lines.push(obj)
  if (!tickListener && onTick) tickListener =
    JsMacros.on('Tick', JavaWrapper.methodToJava(() => 
      lines.forEach(l => l.onTick?.(l))
    ))
  return obj
}

const D2R = Math.PI / 180
let cachePoint
let cam, camPos, pitch, yaw, vec, dist
function getStartingPoint() {
  if (cachePoint) return cachePoint
  cam = Client.getMinecraft().field_1773.method_19418() // .gameRenderer.getCamera()
  with (cam.method_19326()) camPos = [field_1352, field_1351, field_1350]
  pitch = cam.method_19329()
  if (Math.abs(pitch) === 90) return cachePoint = (camPos[1] -= Math.sign(pitch) * 16, camPos)
  yaw = cam.method_19330() * D2R
  vec = [-Math.sin(yaw), -Math.tan(pitch * D2R), Math.cos(yaw)]
  dist = Math.sqrt(vec.reduce((p, v) => p + v ** 2, 0)) / 16
  return cachePoint = vec.map((v, i) => v / dist + camPos[i])
}

/**
 * 
 * @param {EntityHelper} entity 
 * @param {number} offsetX 
 * @param {number} offsetY 
 * @param {number} offsetZ 
 * @returns {(l: TraceLine) => void}
 */
function traceEntityBuilder(entity, offsetX = 0, offsetY = 0.5, offsetZ = 0) {
  return l => {
    if (!entity.isAlive()) return l.remove = true
    l.x = entity.getX() + offsetX
    l.y = entity.getY() + offsetY
    l.z = entity.getZ() + offsetZ
  }
}

function getLines() {
  return lines
}

event.stopListener = JavaWrapper.methodToJava(() => {
  d3d.unregister()
  if (tickListener) JsMacros.off('Tick', tickListener)
})

module.exports = {
  d3d,
  newLine,
  getLines,
  getStartingPoint,
  traceEntityBuilder
}
