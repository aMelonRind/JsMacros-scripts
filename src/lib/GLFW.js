// https://javadoc.lwjgl.org/org/lwjgl/glfw/GLFW.html
const GLFW = Java.type('org.lwjgl.glfw.GLFW')
const Float = Java.type('java.lang.Float')
const handle = Client.getMinecraft().method_22683().method_4490() // .getWindow().getHandle()

/**
 * Requests user attention
 */
function requestAttention() {
  if (!Client.getMinecraft().method_1569()) // .isWindowFocused()
    GLFW.glfwRequestWindowAttention(handle)
}

/**
 * Sets the opacity of the whole window
 * @param {number} opacity 0.0-1.0
 */
function setOpacity(opacity = 1.0) {
  GLFW.glfwSetWindowOpacity(handle, new Float(opacity))
}

/** @typedef {_&modu} GLFWHelper */
const modu = {
  requestAttention,
  setOpacity
}

/** @type {GLFWHelper} */
module.exports = null ?? modu
