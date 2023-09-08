
const NbtElementHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper')
const NbtIo = Java.type('net.minecraft.class_2507')

class NbtIoHelper {

  /**
   * @param {string} path 
   * @param {NBTElementHelper$NBTCompoundHelper} nbt 
   * @returns {void}
   */
  static writeCompressed(path, nbt) {
    return this.writeRawCompressed(path, nbt?.getRaw())
  }

  /**
   * @param {string} path 
   * @param {NbtCompound} nbt 
   * @returns {void}
   */
  static writeRawCompressed(path, nbt) {
    return NbtIo.method_30614(nbt, FS.toRawPath(path).toAbsolutePath().toFile())
  }

  /**
   * @param {string} path 
   * @returns {NBTElementHelper$NBTCompoundHelper?}
   */
  static readCompressed(path) {
    const nbt = this.readRawCompressed(path)
    return nbt ? NbtElementHelper.resolve(nbt) : null
  }

  /**
   * @param {string} path 
   * @returns {NbtCompound?} 
   */
  static readRawCompressed(path) {
    return NbtIo.method_30613(FS.toRawPath(path).toAbsolutePath().toFile())
  }

}

module.exports = NbtIoHelper
