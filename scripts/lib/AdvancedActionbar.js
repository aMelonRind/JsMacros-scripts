
// util.actionbar

/** @typedef {import('./type/myTypes')} */

const Element = Java.type('xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$RenderElement')
const Text = Java.type('xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Text')
const TextHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.TextHelper')
const moveKeys = {
  ['key.mouse.left']:     1 << 0,
  ['key.mouse.right']:    1 << 1,
  ['key.keyboard.w']:     1 << 2,
  ['key.keyboard.a']:     1 << 3,
  ['key.keyboard.s']:     1 << 4,
  ['key.keyboard.d']:     1 << 5,
  ['key.keyboard.space']: 1 << 6
}

/** @param {Util} util */
module.exports = util => {
  if (!util?.toJava) throw new Error('util needed')

  const d2d = Hud.createDraw2D()

  const animData = {
    x: 0,
    y: 0,
    lineMin: 0,
    opacity: 1.0,
    tomListening: false,
    transparentOnMove: false,
    minTransparency: 0.1,
    pressingKey: 0, // bitfield
    lastMoveTick: -Infinity,
    lastYaw: 0,
    lastPitch: 0,
    fade: {
      notify: [],
      action: []
    },
    fadeStart: 200,
    fadeTime: 20,
    xoffset: 0,
    yoffset: -40,
    speed: 8,
    max: {
      notify: 4,
      action: 4
    },
    gap: 11 // preadded text height 8
  }

  const alphas = {
    title: 1.0,
    subtitle: 0.0,
    actionLine: 0.0,
    notifyLine: 0.0,
    action: 1.0, // newest one
    notify: 1.0  // newest one
  }

  const elements = {
    /** @type {RenderCommon$Text[]} */
    notify: [],
    notifyLine: d2d.addRect(0, 0, 0, 0, 0x01FFFFFF, 0, 0, 4),
    title: d2d.addText('Idle', 0, 0, 0xFFAF00, 3, true),
    subtitle: d2d.addText('', 0, 0, 0xFFFFFF, 2, true),
    actionLine: d2d.addRect(0, 0, 0, 0, 0x01FFFFFF, 0, 0, 4),
    /** @type {RenderCommon$Text[]} */
    action: []
  }

  d2d.setOnInit(util.toJava(() => {
    animData.x = Math.floor(d2d.getWidth() / 2) + animData.xoffset
    animData.y = d2d.getHeight() + animData.yoffset
    animData.lineMin = Math.min(100, Math.floor(d2d.getWidth() / 8))
    Object.values(elements).flat().forEach(e => {
      if (e instanceof Element) d2d.reAddElement(e)
    })
  }))

  d2d.register()
  util.stopListeners.push(() => d2d.unregister())

  let animating = false

  let p
  let lineLength = 0
  let temp       = 0
  let cap        = 0
  let alpha      = 0
  let alphaMul   = 1
  let should     = false
  let first      = false
  async function animation() {
    if (animating) return animating.call?.()
    animating = true
    while (animating) {
      animating = false

      // calculate alpha multiplier
      alphaMul = util.math.clamp((util.ticks - animData.lastMoveTick - 20) / 10, animData.minTransparency)
        * animData.opacity

      // calculate next line length
      temp = Math.max(Math.floor(util.getTextWidth(getString(elements.title)) * 0.4), animData.lineMin)
      lineLength += Math.sign(temp - lineLength)
      lineLength += Math.round((temp - lineLength) / animData.speed)
      if (temp !== lineLength) animating = true
      
      // center four constant element, from bottom to top
      elements.actionLine.setPos(
        animData.x - lineLength,
        temp = animData.y - animData.max.action * animData.gap - 3,
        animData.x + lineLength + 1,
        temp + 1
      )

      should = !!getString(elements.subtitle)
      if (between0and1(alphas.subtitle) || (should ^ !!alphas.subtitle)) {
        animating = true
        alphas.subtitle = util.math.clamp(alphas.subtitle + (should ? 1 : -1) / animData.speed)
      }
      setAlpha(elements.subtitle, alphas.subtitle)
      elements.subtitle.setPos(
        getX(elements.subtitle),
        elements.actionLine.y2 - Math.ceil((1 - (1 - alphas.subtitle) ** 2) * animData.gap)
      )

      elements.title.setPos(
        getX(elements.title),
        elements.subtitle.y - animData.gap - !alphas.subtitle
      )
      setAlpha(elements.title, alphas.title * alphaMul)

      elements.notifyLine.setPos(
        animData.x - lineLength,
        temp = elements.title.y - animData.gap + 7,
        animData.x + lineLength + 1,
        temp + 1
      )

      // notify and action
      for (const [type, property] of dynamicText) {
        // remove all if max is 0
        if (animData.max[type] <= 0) elements[type].splice(0).forEach(removeText)
        if (elements[type].length) {
          // find newest text element, calculate alpha
          temp = elements[type].findIndex(notText)
          if (temp === -1) temp = elements[type].length

          alphas[type] += temp === -1 ? 0 : (elements[type].length - temp) / animData.speed
          if (alphas[type] < 1) Math.min(alphas[type] += 1 / animData.speed, 1)
          temp--
          if (alphas[type] > 1) {
            temp         += Math.ceil(alphas[type]) - 1
            alphas[type] -= Math.ceil(alphas[type]) - 1
          }
          if (alphas[type] < 1) animating = true

          // update texts from newest
          toText(type, temp)
          alpha = Math.max(alphas[type], 1/230)
          elements[type][temp].setPos(
            getX(elements[type][temp]),
            property.nearLineY(alpha)
          )
          cap = property.cap()
          first = true
          for (temp--; temp >= 0; temp--) {
            toText(type, temp)
            elements[type][temp].setPos(
              getX(elements[type][temp]),
              property.y(temp, first ? alpha : undefined)
            )
            first = false
            if (property.outrangeCondition(elements[type][temp].y, cap)) {
              // remove overflow
              elements[type].splice(0, temp).forEach(removeText)
              temp = elements[type].findIndex(notText)
              if (temp === -1) temp = elements[type].length
              animData.fade[type].splice(0, animData.fade[type].length - temp)
              break
            }
          }
          temp = elements[type].findIndex(notText)
          if (temp === -1) temp = elements[type].length
          first = true
          // update text alpha
          while (--temp >= 0) {
            if (!setAlpha(
                  elements[type][temp],
                  Math.min(
                    first ? alpha : 1,
                    temp === 0 ? property.lastAlpha(cap) : 1,
                    getFadeAlpha(animData.fade[type][temp])
                  )
                )) {
              // remove expired
              elements[type].splice(0, temp + 1).forEach(removeText)
              animData.fade[type].splice(0, temp + 1)
              break
            }
            first = false
        }

          if (notText(elements[type].at(-1))) animating = true
        }

        // process line alpha after dynamic text
        temp = alphas[`${type}Line`]
        should = !!(elements[type].length && animData.max[type])
        if (between0and1(temp) || (should !== !!temp)) {
          animating = true
          alphas[`${type}Line`] = util.math.clamp(temp + (should ? 1 : -1) / animData.speed)
        }
        elements[`${type}Line`].setAlpha(Math.round(alphas[`${type}Line`] * alphaMul * 255))
      }

      if (animating) await util.waitTick()
      else if (animData.fade.notify[0] || animData.fade.action[0]) {
        // since the promise below may resolve before 1 tick passes
        const wait = util.waitTick()
        // wait for fade time
        await new Promise(res => {
          util.waitTick(
            Math.min(
              animData.fade.notify[0] ?? Infinity,
              animData.fade.action[0] ?? Infinity
            ) + animData.fadeStart - util.ticks,
            animating = res
          )
        })
        await wait
      }
    }
  }

  const dynamicText = Object.entries({
    action: {
      nearLineY: alpha => elements.actionLine.y1 + 1 +
        Math.floor((animData.gap - 8) * alpha),
      cap: () => elements.actionLine.y2 + animData.gap * animData.max.action - 8,
      y: (temp, alpha) => elements.action[temp + 1].y + animData.gap + (alpha ? -8 +
        Math.ceil((1 - ((1 - alpha) ** 2)) * 8) : 0),
      outrangeCondition: (a, b) => a >= b,
      lastAlpha: cap => 1 - (elements.action[0].y - cap) / animData.gap
    },
    notify: {
      nearLineY: alpha => elements.notifyLine.y1 -
        Math.ceil((animData.gap - 8) * alpha) - 8,
      cap: () => elements.notifyLine.y1 - animData.gap * animData.max.notify,
      y: (temp, alpha) => elements.notify[temp + 1].y - animData.gap + (alpha ? 8 -
        Math.ceil((1 - ((1 - alpha) ** 2)) * 8) : 0),
      outrangeCondition: (a, b) => a <= b,
      lastAlpha: cap => 1 - (cap - elements.notify[0].y) / animData.gap
    }
  })

  /**
   * convert to text if it's not
   * @param {'notify' | 'action'} type 
   * @param {number | string} index 
   */
  function toText(type, index = 0) {
    if (elements[type][index] instanceof Text) return false
    elements[type][index] = d2d.addText(elements[type][index], 0, 0, 0x01FFFFFF, true)
    animData.fade[type].push(util.ticks)
    return true
  }

  function notText(txt) {
    return !(txt instanceof Text)
  }

  function removeText(t) {
    if (t instanceof Text) d2d.removeText(t)
  }

  function getFadeAlpha(time = 0) {
    return util.math.clamp(1 - (util.ticks - time - animData.fadeStart) / animData.fadeTime)
  }

  // function getAlpha(txt) {
  //   if (notText(txt)) return 1
  //   return Math.max(0, ((txt.color >>> 24) || 255) - 25) / 230
  // }

  /**
   * redefine alpha due to how text renders  
   * 0 -> 255  
   * 1 ~ 25 -> 0  
   * range 25 ~ 255 (0 ~ 230)
   */
  function setAlpha(txt, alpha) {
    if (notText(txt)) return
    if (between0and1(alpha)) animating ||= true
    const r = alpha > 0
    alpha = Math.round(util.math.clamp(alpha) * alphaMul * 230 + 25)
    if (!(alpha >= 25 && alpha <= 255)) return
    txt.color = (txt.color & 0xFFFFFF) | (alpha << 24)
    txt.zIndex = alpha === 255 ? 1 : 0
    return r
  }

  function getString(msg) {
    if (msg instanceof Text)       msg = msg.getText()
    if (msg instanceof TextHelper) msg = msg.getString()
    return (typeof msg === 'string') ? msg : ''
  }

  function getX(msg = '') {
    msg = util.getTextWidth(getString(msg))
    if (d2d.getWidth() - 6 > msg) {
      msg /= 2
      // normal
      if (!animData.xoffset || (animData.x + 3 > msg && d2d.getWidth() - animData.x + 3 > msg))
        return animData.x - Math.ceil(msg)
      //snap
      else if (animData.xoffset < 0) return 3
      else return d2d.getWidth() - 3 - msg * 2
    }else {
      // scrolling text
      msg -= d2d.getWidth() - 6
      return 3 - util.math.clamp(util.ticks % (msg + 40) - 20, 0, msg)
    }
  }

  function between0and1(n) {
    return n > 0 && n < 1
  }

  util.waitTick(1, animation)

  return {

    /**
     * Draw2D
     * @readonly
     */
    get d2d() {
      return d2d
    },

    /**
     * x offset
     * @param {number} offset
     * @default 0
     */
    setXoffset(offset = 0) {
      if (typeof offset === 'number') animData.xoffset = Math.round(offset)
      animData.x = Math.floor(d2d.getWidth() / 2) + animData.xoffset
      animation()
    },

    /**
     * y offset
     * @param {number} offset
     * @default -40
     */
    setYoffset(offset = -40) {
      if (typeof offset === 'number') animData.yoffset = Math.round(offset)
      animData.y = d2d.getHeight() - 40 + animData.yoffset
      animation()
    },

    /**
     * fade start in ticks
     * @param {number} ticks
     * @default 200
     */
    setFadeStart(ticks = 200) {
      if (typeof ticks === 'number' && ticks >= 0) animData.fadeStart = Math.round(ticks)
    },

    /**
     * fade start in ticks
     * @param {number} ticks
     * @default 20
     */
    setFadeTime(ticks = 20) {
      if (typeof ticks === 'number' && ticks >= 0) animData.fadeTime = Math.round(ticks)
    },

    /**
     * @param {number} max
     * @default 4
     */
    setNotifyMax(max = 4) {
      if (typeof max === 'number' && max >= 0) animData.max.notify = max
      animation()
    },

    /**
     * @param {number} max
     * @default 4
     */
    setActionMax(max = 4) {
      if (typeof max === 'number' && max >= 0) animData.max.action = max
      animation()
    },

    /**
     * animation speed  
     * less is faster, more like period time
     * @param {number} speed
     * @default 8
     */
    setSpeed(speed = 8) {
      if (typeof speed === 'number' && speed >= 1) animData.speed = Math.round(speed)
    },

    /**
     * @param {number} gap
     * @default 3
     */
    setGap(gap = 3) {
      if (typeof gap === 'number' && gap >= 0) animData.gap = gap + 8
      animation()
    },

    setTitleColor(color = 0xFFAF00) {
      if (color > 0 && color <= 0xFFFFFF) elements.title.color = color
    },

    setSubtitleColor(color = 0xFFFFFF) {
      if (color > 0 && color <= 0xFFFFFF) elements.subtitle.color = color
    },

    setOpacity(opacity = 1.0) {
      animData.opacity = util.math.clamp(opacity) ?? 1.0
      animation()
    },

    /**
     * will be transparent if pressing wasd, space, mouse left or mouse right  
     * or yaw/pitch change
     * @param {boolean} enabled 
     * @param {number} minOpacity 
     */
    setTransparentOnMove(enabled = false, maxTransparency = 0.9) {
      animData.minTransparency = 1 - (util.math.clamp(maxTransparency) ?? 0.9)
      if (animData.transparentOnMove = !!enabled) {
        p = Player.getPlayer()
        animData.lastYaw = p.getYaw()
        animData.lastPitch = p.getPitch()
        if (!animData.keyListener) {
          KeyBind.getPressedKeys().forEach(k => {
            if (moveKeys[k]) animData.pressingKey |= moveKeys[k]
          })
          util.on('Key', e => {
            if (!(e.key in moveKeys)) return
            if (e.action) animData.pressingKey |= moveKeys[e.key]
            else animData.pressingKey &= ~moveKeys[e.key]
            if (animData.pressingKey) {
              animData.lastMoveTick = Infinity
              animation()
            }else animData.lastMoveTick = util.ticks
          })
          util.on('Tick', () => {
            if (!animData.transparentOnMove || animData.lastMoveTick === Infinity) return
            p = Player.getPlayer()
            if (animData.lastYaw === p.getYaw() && animData.lastPitch === p.getPitch()) return
            animData.lastYaw = p.getYaw()
            animData.lastPitch = p.getPitch()
            animData.lastMoveTick = util.ticks
            animation()
          })
          animData.tomListening = true
        }
      }else animData.lastMoveTick = -Infinity
      animation()
    },
    
    /**
     * change title
     * @param {TextHelper | string} msg 
     */
    title(msg = 'Idle') {
      elements.title.setText(msg || 'Idle')
      elements.title.x = getX(elements.title)
      animation()
    },
    
    /**
     * change subtitle
     * @param {TextHelper | string} msg 
     */
    subtitle(msg = '') {
      elements.subtitle.setText(msg)
      elements.subtitle.x = getX(elements.subtitle)
      animation()
    },

    /**
     * push notify
     * @param {TextHelper | string} msg 
     */
    notify(msg = '') {
      elements.notify.push(msg)
      animation()
    },

    /**
     * push action
     * @param {TextHelper | string} msg 
     */
    action(msg = '') {
      elements.action.push(msg)
      animation()
    }

  }
}
