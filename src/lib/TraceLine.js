
if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')

/** @type {IEventListener=} */ 
let tickListener
/** @type {Set<TraceLine>} */
const lines = new Set

/** @type {Draw3D} */
const d3d = Reflection.createClassProxyBuilder(Hud.createDraw3D().getClass())
    .addMethod('render', JavaWrapper.methodToJava((ref, args) => {
  newFrame = true
  if (lines.size === 0) return ref.parent(args)
  getStartingPoint()
  lines.forEach(l => {
    if (!l.remove) l.onFrame?.(l)
    if (l.remove) {
      d3d.removeLine(l.line)
      lines.delete(l)
      return
    }
    l.line.setPos(...cachePoint, l.x, l.y, l.z)
  })
  return ref.parent(args)
})).buildInstance([])
d3d.register()

/**
 * @param {number} color 
 * @param {(line: TraceLine) => void} [onTick] will run extra once on creation, won't have line property on first call
 * @param {(line: TraceLine) => void} [onFrame] 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @returns {TraceLine?}
 */
function newLine(color = 0xFFFFFF, onTick, onFrame, x = 0, y = 0, z = 0) {
  /** @type {TraceLine} */
  const obj = {
    onTick,
    onFrame,
    x, y, z,
    remove: false,
    line: undefined
  }
  obj.onTick?.(obj)
  if (obj.remove) return null

  obj.line = d3d.addLine(0, 0, 0, 0, 0, 0, color)
  lines.add(obj)
  if (!tickListener && onTick) tickListener =
    JsMacros.on('Tick', JavaWrapper.methodToJava(() => 
      lines.forEach(l => l.onTick?.(l))
    ))
  return obj
}

let newFrame = true
/** @type {Pos3DTuple} */
const cachePoint = [0, 0, 0]

let _cam, _pos
function getStartingPoint() {
  if (!newFrame) return cachePoint
  _cam = Client.getMinecraft().field_1773.method_19418() // .gameRenderer.getCamera()
  _pos = _cam.method_36425().method_36427(0, 0).method_1021(320).method_1019(_cam.method_19326())
  // .getProjection().getPosition(factorX, factorY).multiply(value).add(vec) cam.getPos()
  cachePoint[0] = _pos.field_1352
  cachePoint[1] = _pos.field_1351
  cachePoint[2] = _pos.field_1350
  newFrame = false
  return cachePoint
}

/**
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

module.exports = {
  d3d,
  newLine,
  getLines,
  getStartingPoint,
  traceEntityBuilder,
  stopListener: event.stopListener = JavaWrapper.methodToJava(() => {
    d3d.unregister()
    if (tickListener) JsMacros.off('Tick', tickListener)
  })
}

/**
 * @typedef {{
 *  x: number
 *  y: number
 *  z: number
 *  color: number
 *  remove: boolean
 *  onTick?: (line: TraceLine) => void
 *  onFrame?: (line: TraceLine) => void
 *  line?: Draw3D$Line
 * }} TraceLine
 */
