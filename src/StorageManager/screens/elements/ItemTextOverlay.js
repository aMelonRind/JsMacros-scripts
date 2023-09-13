// @ts-check
/** @type {typeof Packages.xyz.wagyourtail.jsmacros.client.api.classes.render.components.Text} */// @ts-ignore
const TextProxy = (() => {
  const className = 'MelonRind$RenderElement$ItemTextOverlay' // + `$Test${GlobalVars.getAndIncrementInt('classtesting')}`
  try {
    return Java.type('xyz.wagyourtail.jsmacros.core.library.impl.classes.proxypackage.' + className)
  } catch (e) {}
  const Text = 'xyz.wagyourtail.jsmacros.client.api.classes.render.components.Text'
  const DrawContext = 'net.minecraft.class_332'

  const render = 'method_25394'
  const getMatrices = 'method_51448'
  const push = 'method_22903'
  const translate = 'method_46416'
  const pop = 'method_22909'

  {{ // shift bracket color in java code to blue on vscode
  return Reflection.createClassBuilder(className, Java.type(Text))
    .addMethod(`public void ${render}(${DrawContext} context, int mouseX, int mouseY, float tickDelta) {
      context.${getMatrices}().${push}();
      context.${getMatrices}().${translate}(0.0F, 0.0F, 200.0F);
      super.${render}(context, mouseX, mouseY, tickDelta);
      context.${getMatrices}().${pop}();
    }`).finishBuildAndFreeze()
  }}
})()

class ItemTextOverlay {

  /**
   * this method can create a `Text` rendering component that'll be rendered on top of item.
   * @param {string | TextHelper} text 
   * @param {int} x 
   * @param {int} y 
   * @param {int} color 
   * @param {int} zIndex 
   * @param {boolean} shadow 
   * @param {double} scale 
   * @param {float} rotation 
   * @returns {Text}
   */
  static create(text, x, y, color = 0xFFFFFF, zIndex = 0, shadow = true, scale = 1.0, rotation = 0.0) {
    // @ts-ignore
    return new TextProxy(text, x, y, color, zIndex, shadow, scale, rotation)
  }

  constructor () { throw 'not here, use ItemTextOverlay.create()' }

}

module.exports = ItemTextOverlay
