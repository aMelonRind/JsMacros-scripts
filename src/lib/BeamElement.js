//@ts-check

/** @type {*} */
const BeamJava = (((() => { // shift bracket color in java code to blue on vscode
  // TODO: remove 'ah'
  const className = 'MelonRind$RenderElement$Beam' + 'ah' // + `$Test${GlobalVars.getAndIncrementInt('classtesting')}`
  try {
    return Java.type('xyz.wagyourtail.jsmacros.core.library.impl.classes.proxypackage.' + className)
  } catch {}
  const Line3D = 'xyz.wagyourtail.jsmacros.client.api.classes.render.components3d.Line3D'
  const VertexConsumerProvider$Immediate = 'net.minecraft.class_4597$class_4598'
  const MinecraftClient = 'net.minecraft.class_310'
  const DrawContext = 'net.minecraft.class_332'
  const BufferBuilder = 'net.minecraft.class_287'
  const MatrixStack = 'net.minecraft.class_4587'
  const Identifier = 'net.minecraft.class_2960'
  const BeaconBlockEntityRenderer = 'net.minecraft.class_822'

  const of = 'method_60654'
  const getInstance = 'method_1551'
  const world = 'field_1687'
  const getTime = 'method_8510'
  const BEAM_TEXTURE = 'field_4338'
  const renderBeam = 'method_3545'
  const drawCurrentLayer = 'method_37104'
  const getMatrices = 'method_51448'
  const push = 'method_22903'
  const translate = 'method_46416'
  const pop = 'method_22909'

  Reflection.createClassBuilder(className, Java.type(Line3D))
    .addField(`public static ${VertexConsumerProvider$Immediate} vcp;`)
    .addField(`private static final ${MinecraftClient} mc = ${MinecraftClient}.${getInstance}();`)
    .addField(`private static final ${Identifier} DEFAULT_BEAM_TEXTURE = ${BeaconBlockEntityRenderer}.${BEAM_TEXTURE};`)
    .addField(`public ${Identifier} texture = DEFAULT_BEAM_TEXTURE;`)
    .addField(`public float heightScale = 1.0f;`)
    .addField(`public int length = 1024;`)
    .addField(`public float innerRadius = 0.2f;`)
    .addField(`public float outerRadius = 0.25f;`)
    .addField(`public float speed = 1.0f;`)
    .addConstructor(`public ${className}(double x, double y, double z, int color) {
      super(x, y, z, 0.0, 0.0, 0.0, color, true);
    }`)
    .addMethod(`public void setHeightScale(double value) { heightScale = (float) value; }`)
    .addMethod(`public void setLength(double value) { length = (int) value; }`)
    .addMethod(`public void setInnerRadius(double value) { innerRadius = (float) value; }`)
    .addMethod(`public void setOuterRadius(double value) { outerRadius = (float) value; }`)
    .addMethod(`public void setSpeed(double value) { speed = (float) value; }`)
    .addMethod(`public void setTexture(String id) {
      texture = id == null || DEFAULT_BEAM_TEXTURE.toString().equals(id) ? DEFAULT_BEAM_TEXTURE : ${Identifier}.${of}(id);
    }`)
    .addMethod(`protected float _getDelta(float tickDelta, float speed) {
      if (speed == 0.0f) return 0.0f;
      float delta = (float) Math.floorMod((long) mc.${world}.${getTime}(), (int) (Math.abs(speed) < 1 ? 40000 : 40)) + tickDelta;
      if (speed != 1.0f) {
        delta *= speed;
        delta %= 40;
        if (delta < 0) delta += 40;
      }
      return delta;
    }`)
    .addMethod(`public void render(${DrawContext} drawContext, float tickDelta) {
      ${MatrixStack} mat = drawContext.${getMatrices}();
      final float speed = this.speed;
      mat.${push}();
      mat.${translate}((float) pos.x1 - 0.5f, (float) pos.y1, (float) pos.z1 - 0.5f);
      long time = 0L;
      float delta = _getDelta(tickDelta, speed);
      if (delta >= 1.0f) {
        time = (long) Math.floor((double) delta);
        delta -= time;
      }
      ` +
      // reference: BeaconBlockEntityRenderer.renderBeam(
      //   MatrixStack matrices,
      //   VertexConsumerProvider vertexConsumers,
      //   Identifier textureId,
      //   float tickDelta,
      //   float heightScale,
      //   long worldTime,
      //   int yOffset,
      //   int maxY,
      //   float[] color,
      //   float innerRadius,
      //   float outerRadius
      // )
      `${BeaconBlockEntityRenderer}.${renderBeam}(
        mat,
        vcp,
        texture,
        delta,
        heightScale,
        time,
        0,
        length,
        color,
        innerRadius,
        outerRadius
      );
      vcp.${drawCurrentLayer}();
      mat.${pop}();
    }`).finishBuildAndFreeze()
  /** @type {*} */
  const compiled = Java.type('xyz.wagyourtail.jsmacros.core.library.impl.classes.proxypackage.' + className)

  // accessing private field in js is more convenient
  const bufferBuildersF = Java.type('net.minecraft.class_761').class.getDeclaredField('field_20951')
  bufferBuildersF.setAccessible(true)
  compiled.vcp = bufferBuildersF.get(Client.getMinecraft().field_1769).method_23000() // getEntityVertexConsumers

  return compiled
})))()

class Beam {
  #raw
  get raw() { return this.#raw }
  /** @type {Pos3D} */ get pos() { return this.#raw.pos.getStart() }
  /** @type {double} */ get x() { return this.#raw.pos.x1 }
  /** @type {double} */ get y() { return this.#raw.pos.y1 }
  /** @type {double} */ get z() { return this.#raw.pos.z1 }
  /** @type {int} */ get color() { return this.#raw.color }
  /** @type {string} */ get texture() { return this.#raw.texture.toString() }
  /** @type {float} */ get heightTextureScale() { return this.#raw.heightScale }
  /** @type {int} */ get length() { return this.#raw.length }
  /** @type {float} */ get innerRadius() { return this.#raw.innerRadius }
  /** @type {float} */ get outerRadius() { return this.#raw.outerRadius }
  /** @type {float} */ get speed() { return this.#raw.speed }

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @param {number} color 
   * @param {string?} [texture] null for default
   * @param {number} [length] 
   */
  constructor (x, y, z, color, texture = null, length) {
    this.#raw = new BeamJava(x, y, z, color)
    this.setTexture(texture).setLength(length)
  }

  /**
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   */
  setPos(x, y, z) {
    this.#raw.setPos(x, y, z, 0, 0, 0)
    return this
  }

  setColor(color = 0xFFFFFF) {
    this.#raw.setColor(color & 0xFFFFFF)
    return this
  }

  /**
   * @param {string?} id 
   * @returns 
   */
  setTexture(id = null) {
    this.#raw.setTexture(id)
    return this
  }

  setHeightTextureScale(scale = 1.0) {
    this.#raw.setHeightScale(scale)
    return this
  }

  setLength(length = 1024) {
    this.#raw.setLength(length)
    return this
  }

  setInnerRadius(radius = 0.2) {
    this.#raw.setInnerRadius(radius)
    return this
  }

  setOuterRadius(radius = 0.25) {
    this.#raw.setOuterRadius(radius)
    return this
  }

  setSpeed(speed = 1.0) {
    this.#raw.setSpeed(speed)
    return this
  }

  /**
   * @param {Draw3D} d3d 
   */
  addTo(d3d) {
    d3d.reAddElement(this.#raw)
    return this
  }

  /**
   * @param {Draw3D} d3d 
   */
  removeFrom(d3d) {
    d3d.removeLine(this.#raw)
    return this
  }

}

/**
 * @param {Pos3D} pos 
 * @param {int} color rgb, no alpha
 * @param {string?} [texture] null for default "textures/entity/beacon_beam.png"
 * @param {int} [length] default 1024
 */
function createBeam(pos, color, texture = null, length = 1024) {
  return new Beam(pos.x, pos.y, pos.z, color, texture, length)
}

module.exports = { createBeam, Beam }
