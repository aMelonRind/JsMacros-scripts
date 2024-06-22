// https://javadoc.lwjgl.org/org/lwjgl/glfw/GLFW.html
const /** @type {*} */ GLFW = Java.type('org.lwjgl.glfw.GLFW')
const handle = Client.getMinecraft().method_22683().method_4490() // .getWindow().getHandle()

class GLFWHelper {

  /**
   * Requests user attention
   */
  requestAttention() {
    if (!Client.getMinecraft().method_1569()) // .isWindowFocused()
      GLFW.glfwRequestWindowAttention(handle)
  }

  /**
   * Sets the opacity of the whole window
   * @param {number} opacity 0.0-1.0
   */
  setOpacity(opacity = 1.0) {
    GLFW.glfwSetWindowOpacity(handle, Math.fround(opacity))
  }

}

const glfw = new GLFWHelper()

module.exports = glfw
