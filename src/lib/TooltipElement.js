//@ts-check

/** @type {*} */
const TooltipJava = (((() => { // shift bracket color in java code to blue on vscode
  const className = 'MelonRind$RenderElement$Tooltip' // + `$Test${GlobalVars.getAndIncrementInt('classtesting')}`
  try {
    return Java.type('xyz.wagyourtail.jsmacros.core.library.impl.classes.proxypackage.' + className)
  } catch {}
  const RenderElement = 'xyz.wagyourtail.jsmacros.client.api.classes.render.components.RenderElement'
  const List = 'java.util.List'
  const ItemStack = 'net.minecraft.class_1799'
  const DrawContext = 'net.minecraft.class_332'
  const MatrixStack = 'net.minecraft.class_4587'

  const textRenderer = 'field_1772'
  const render = 'method_25394'
  const drawTooltip = 'method_51434'
  const drawItemTooltip = 'method_51446'
  const getMatrices = 'method_51448'
  const push = 'method_22903'
  const pop = 'method_22909'

  Reflection.createClassBuilder(className, Java.type('java.lang.Object'), Java.type(RenderElement))
    .addField(`public int x;`)
    .addField(`public int y;`)
    .addField(`public int zIndex = 0;`)
    .addField(`public double scale = 1.0;`)
    .addField(`public ${List} tooltip = null;`)
    .addField(`public ${ItemStack} tooltipItem = null;`)
    .addConstructor(`public ${className}(int x, int y) {
      this.x = x;
      this.y = y;
    }`)
    .addMethod(`public int getZIndex() {
      return zIndex;
    }`)
    .addMethod(`public void render(${DrawContext} drawContext, int mouseX, int mouseY, float delta, boolean is3dRender) {
      ${List} tooltip = this.tooltip;
      ${ItemStack} ti = tooltipItem;
      if (tooltip == null && ti == null) return;
      ${MatrixStack} mat = drawContext.${getMatrices}();
      mat.${push}();
      setupMatrix(mat, (double) x, (double) y, (float) scale, 0.0f);
      if (tooltip != null) drawContext.${drawTooltip}(mc.${textRenderer}, tooltip, x, y);
      else drawContext.${drawItemTooltip}(mc.${textRenderer}, ti, x, y);
      mat.${pop}();
    }`)
    .addMethod(`public void ${render}(${DrawContext} drawContext, int mouseX, int mouseY, float delta) {
      render(drawContext, mouseX, mouseY, delta, false);
    }`).finishBuildAndFreeze()
  /** @type {*} */
  const compiled = Java.type('xyz.wagyourtail.jsmacros.core.library.impl.classes.proxypackage.' + className)

  return compiled
})))()

const ItemStackHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper')
const TextHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.TextHelper')
//@ts-ignore
const tooltipTransformer = Hud.createScreen('', true).addButton(0, 0, 1, 1, '', null)

class Tooltip {
  #raw
  get raw() { return this.#raw }
  /** @type {int} */ get x() { return this.#raw.x }
  /** @type {int} */ get y() { return this.#raw.y }
  /** @type {int} */ get zIndex() { return this.#raw.zIndex }
  /** @type {double} */ get scale() { return this.#raw.scale }
  /** @type {TextHelper[]?} */ get tooltip() { return this.#raw.tooltip?.map(t => TextHelper.wrap(t)) ?? null }

  /**
   * @param {int} x 
   * @param {int} y 
   */
  constructor (x, y) {
    this.#raw = new TooltipJava(x, y)
  }

  /**
   * @param {int} x 
   * @param {int} y 
   */
  setPos(x, y) {
    return this.setX(x).setY(y)
  }

  /**
   * @param {int} x 
   */
  setX(x) {
    this.#raw.x = x
    return this
  }

  /**
   * @param {int} y 
   */
  setY(y) {
    this.#raw.y = y
    return this
  }

  /**
   * @param {int} zIndex 
   */
  setZIndex(zIndex = 0) {
    this.#raw.zIndex = zIndex
    return this
  }

  setScale(scale = 1.0) {
    this.#raw.scale = scale
    return this
  }

  /**
   * @param {any[] | ItemStackHelper | null} tooltip 
   */
  setTooltip(tooltip) {
    if (!tooltip) {
      this.#raw.tooltip = null
      this.#raw.tooltipItem = null
      return this
    }
    if (tooltip instanceof ItemStackHelper) {
      this.#raw.tooltip = null
      this.#raw.tooltipItem = tooltip.getRaw()
      return this
    }
    this.#raw.tooltipItem = null
    tooltipTransformer.setTooltip(tooltip)
    this.#raw.tooltip = tooltipTransformer.tooltips
    //@ts-ignore
    tooltipTransformer.tooltips = null
    return this
  }

  /**
   * @param {Draw2D} d2d 
   */
  addTo(d2d) {
    d2d.reAddElement(this.#raw)
    return this
  }

  /**
   * @param {Draw2D} d2d 
   */
  removeFrom(d2d) {
    d2d.removeElement(this.#raw)
    return this
  }

}

/**
 * create tooltip draw2d element
 * @param {int} x 
 * @param {int} y 
 */
function createTooltip(x, y) {
  return new Tooltip(x, y)
}

module.exports = { createTooltip, Tooltip }
