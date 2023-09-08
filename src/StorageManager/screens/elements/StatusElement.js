// @ts-check
const ClickableItemElement = require('./ClickableItemElement')
const ItemTextOverlay = require('./ItemTextOverlay')

const EMPTY_CALLBACK = JavaWrapper.methodToJava(() => {})

class StatusElement extends ClickableItemElement {

  /**
   * @param {ItemId | ItemStackHelper} item 
   * @param {string | TextHelper} overlayText 
   * @param {readonly (string | TextHelper)[] | Iterable<string | TextHelper>} tooltip 
   * @param {MethodWrapper<ButtonWidgetHelper, IScreen> | ((button: ButtonWidgetHelper, screen: IScreen) => any)} clickEvent 
   */
  constructor (item, overlayText, tooltip, clickEvent = EMPTY_CALLBACK) {
    super(item, tooltip, clickEvent)
    this.overlayText = typeof overlayText === 'string'
    ? (overlayText ? Chat.createTextHelperFromString(overlayText) : null)
    : (overlayText.getString() ? overlayText : null)
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
    if (this.overlayText) this.recordElements(screen, screen.reAddElement(
      ItemTextOverlay.create(this.overlayText, x + 8 - Math.floor(this.overlayText.getWidth() / 2), y + 5, 0xFFFFFF, zIndex)
    ))
    return super.addTo(screen, x, y, zIndex)
  }

}

module.exports = StatusElement
