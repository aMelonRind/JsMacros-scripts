// @ts-check
/** @type {typeof Packages.java.util.HashMap} */// @ts-ignore
const WeakHashMap = Java.type('java.util.WeakHashMap')

class BaseElement {
  /** @readonly */
  static EMPTY_TEXTURE_ID = (() => {
    // return 'debug'
    if (Hud.getRegisteredTextures().containsKey('minecraft:dynamic/jsmimage/empty_1')) return 'minecraft:dynamic/jsmimage/empty_1'
    return Hud.createTexture(1, 1, 'empty').update().getIdentifier()
  })()

  /**
   * @type {JavaMap<IDraw2D, RenderElement[]>}
   * @readonly
   * @private
   */
  static elements

  /**
   * clears the elements that is previously added with {@link recordElements}
   * @param {IDraw2D} id2d 
   */
  static clearElements(id2d) {
    if (!this.elements) return
    this.elements.get(id2d)?.forEach(e => id2d.removeElement(e))
    this.elements.remove(id2d)
  }

  /**
   * @param {IDraw2D} id2d 
   * @param {(screenSize: Pos2D) => Pos2D} cb 
   * @param {int} zIndex 
   */
  computePosThenAddTo(id2d, cb, zIndex = 0) {
    const pos = cb(PositionCommon.createPos(id2d.getWidth(), id2d.getHeight()))
    return this.addTo(id2d, Math.floor(pos.x), Math.floor(pos.y), zIndex)
  }

  /**
   * @param {IDraw2D} id2d 
   * @param {int} x
   * @param {int} y
   * @param {int} zIndex
   */
  addTo(id2d, x, y, zIndex = 0) {}

  /**
   * store the elements in a weakmap
   * @param {IDraw2D} id2d 
   * @param {readonly (RenderElement?)[]} elements 
   */
  recordElements(id2d, ...elements) {
    // @ts-ignore
    this.constructor.elements ??= new WeakHashMap()
    // @ts-ignore
    if (!this.constructor.elements.containsKey(id2d)) this.constructor.elements.put(id2d, elements.filter(v => v))
    // @ts-ignore
    else this.constructor.elements.get(id2d).push(...elements.filter(v => v))
  }

}

module.exports = BaseElement
