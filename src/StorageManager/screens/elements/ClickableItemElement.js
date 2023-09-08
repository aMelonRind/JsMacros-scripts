// @ts-check
const SmartWrapper = require('../../lib/SmartWrapper')
const BaseElement = require('./BaseElement')

const EMPTY_CALLBACK = JavaWrapper.methodToJavaAsync(() => {})

class ClickableItemElement extends BaseElement {

  /**
   * @param {ItemId | ItemStackHelper} item 
   * @param {readonly (string | TextHelper)[] | Iterable<string | TextHelper>} tooltip 
   * @param {MethodWrapper<ButtonWidgetHelper, IScreen> | ((button: ButtonWidgetHelper, screen: IScreen) => any)} clickEvent 
   */
  constructor (item, tooltip, clickEvent = EMPTY_CALLBACK) {
    super()
    this.item = item
    this.tooltip = tooltip
    this.clickEvent = SmartWrapper.warp(clickEvent)
  }

  /**
   * @override
   * @param {IScreen} screen 
   * @param {int} x
   * @param {int} y
   * @param {int} zIndex
   * @returns {ButtonWidgetHelper} for callback identifing
   */
  addTo(screen, x, y, zIndex = 0) {
    const btn = screen.addTexturedButton(x - 1, y - 1, 18, 18, 0, 0, 0, BaseElement.EMPTY_TEXTURE_ID, 18, 18, this.clickEvent)
    btn.zIndex = zIndex
    if (this.tooltip) btn.setTooltip(...this.tooltip)
    // @ts-ignore
    this.recordElements(screen, screen.addItem(x, y, zIndex, this.item).setOverlayText(''), btn)
    return btn
  }

}

module.exports = ClickableItemElement
