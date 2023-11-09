// @ts-check
class SimpleTraceEntity {
  /** @readonly @type {Draw3D} */
  d3d
  /** @readonly @type {EntityTraceLine$Builder} */
  builder
  /** @readonly @type {IEventListener} */
  loadListener
  /** @type {IEventListener=} */
  dimensionListener

  /**
   * create a new tracer
   * @param {number} color 
   * @param {EntityId | EntityId[] | Filterer} filter 
   */
  static trace(color, filter, excludeSelf = false, alpha = 0xFF) {
    JavaWrapper.methodToJavaAsync(() => null).run()
    return new this(color, filter, excludeSelf, alpha)
  }

  /**
   * @param {number} color 
   * @param {EntityId | EntityId[] | Filterer} filter 
   */
  constructor (color, filter = () => true, excludeSelf = false, alpha = 0xFF) {
    if (typeof filter !== 'function') {
      if (typeof filter === 'string') {
        const type = filter
        filter = e => e.getType() === type
        if (excludeSelf && type !== 'minecraft:player') excludeSelf = false
      } else if (Array.isArray(filter)) {
        const types = filter
        filter = e => types.includes(e.getType())
        if (excludeSelf && !types.includes('minecraft:player')) excludeSelf = false
      } else throw new TypeError(`unknwown filter type ${typeof filter}`)
    }
    this.d3d = Hud.createDraw3D()
    this.builder = this.d3d.entityTraceLineBuilder().color(color).alpha(alpha)
    if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')
    this.d3d.register()
    const finalFilter = filter.bind(this)
    /** @type {(entity: EntityHelper) => void} */
    const check = excludeSelf
      ? e => { if (!Player.getPlayer().equals(e) && finalFilter(e)) this.builder.buildAndAdd(e) }
      : e => { if (finalFilter(e)) this.builder.buildAndAdd(e) }
    this.loadListener = JsMacros.on('EntityLoad', JavaWrapper.methodToJava(e => check(e.entity)))
    World.getEntities().forEach(JavaWrapper.methodToJava(check))
    if (excludeSelf) this.enableDimensionClear()
  }

  stop() {
    this.d3d.unregister()
    JsMacros.off('EntityLoad', this.loadListener)
    if (this.dimensionListener) JsMacros.off('DimensionChange', this.dimensionListener)
  }

  /**
   * registers the stop method to `event.stopListener`
   */
  registerStopListener() {
    try {
      JsMacros.assertEvent(event, 'Service')
    } catch (e) {
      this.stop()
      JsMacros.assertEvent(event, 'Service')
    }
    const stop = JavaWrapper.methodToJava(() => this.stop())
    event.stopListener = event.stopListener ? stop.andThen(event.stopListener) : stop
    return this
  }

  /**
   * if you saw some line points to nothing after changing dimention, enable this
   */
  enableDimensionClear() {
    this.dimensionListener ??= JsMacros.on('DimensionChange', JavaWrapper.methodToJava(() => {
      this.d3d.getEntityTraceLines().forEach(JavaWrapper.methodToJava(l => this.d3d.removeTraceLine(l)))
    }))
    return this
  }

}

module.exports = SimpleTraceEntity

/**
 * @typedef {(this: SimpleTraceEntity, entity: EntityHelper) => boolean | void} Filterer
 */
