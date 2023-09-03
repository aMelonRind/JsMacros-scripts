
/*
 * to fill coords in the chat, customizable
 * keywords:
 *  pos: player block pos
 *  bpos: looking at block pos
 *  cpos: camera pos, for freecam
 * add a comma (,) to separate with comma
 * 
 * is service script
 */

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')

const listeners = [
  { // bpos: block pos
    /** @type {BlockDataHelper?} */
    block: null,
    /** @type {OpenChatScreenListener} */
    onOpenChatScreen() {
      this.block = Player.rayTraceBlock(8, false)
    },
    /** @type {KeywordListener} */
    onKeyword(keyword, sym) {
      if (keyword !== 'bpos') return
      if (!(this.block ??= Player.rayTraceBlock(8, false))) return
      if (sym === ',') return `${this.block.getX()}, ${this.block.getY()}, ${this.block.getZ()}`
      if (sym === '')  return `${this.block.getX()} ${this.block.getY()} ${this.block.getZ()} `
    }
  },
  { // pos: player pos
    /** @type {KeywordListener} */
    onKeyword(keyword, sym) {
      if (keyword !== 'pos') return
      const pos = Player.getPlayer().getPos()
      const x = Math.floor(pos.x)
      const y = Math.floor(pos.y)
      const z = Math.floor(pos.z)
      if (sym === ',') return `${x}, ${y}, ${z}`
      if (sym === '')  return `${x} ${y} ${z} `
    }
  },
  { // cpos: camera pos
    /** @type {KeywordListener} */
    onKeyword(keyword, sym) {
      if (keyword !== 'cpos') return
      const cam = Client.getMinecraft().field_1773.method_19418().method_19326() // .gameRenderer.getCamera().getPos()
      const x = Math.floor(cam.field_1352)
      const y = Math.floor(cam.field_1351)
      const z = Math.floor(cam.field_1350)
      if (sym === ',') return `${x}, ${y}, ${z}`
      if (sym === '')  return `${x} ${y} ${z} `
    }
  },
  { // caps convert to lower case
    /** @type {ChangeListener} */
    onChange(text, cursor) {
      text = text.slice(0, cursor)
      if (text.length > 3 && /[A-Z]/.test(text) && /^[A-Z ,.!?]+$/.test(text))
        return new Suggestion(0, cursor, text.toLowerCase())
    }
  },
  { // can convert zhuyin(english) to chinese, powered by google input tools
    // /** @type {ChangeListener} */
    // onChange(text, cursor) {
    //   const final = []
    //   if (cursor < text.length && this.regex.test(text.charAt(cursor))) {
    //     const res = this.fromZhuyin(text.slice(cursor).match(this.regex)[0])
    //     if (res) final.push(...res[0].map((text, i) => new Suggestion(cursor, cursor + res[1][i], text)))
    //   }
    //   const match = text.match(this.regex)
    //   if (match && match.index !== cursor) {
    //     const res = this.fromZhuyin(match[0])
    //     if (res) final.push(...res[0].map((text, i) => new Suggestion(match.index, match.index + res[1][i], text)))
    //   }
    //   return final
    // },

    // regex: /[ A-Za-z0-9,./;-]+/,

    // /** @type {string[]} */
    // cacheIndex: [],
    // /** @type {Record<string, string[] | null>} */
    // cache: {},

    // /**
    //  * @param {string} key 
    //  * @param {string[] | null} value 
    //  * @returns 
    //  */
    // storeCache(key, value) {
    //   this.cacheIndex.push(key)
    //   this.cache[key] = this.clone(value)
    //   if (this.cacheIndex.length > 256) this.cacheIndex.splice(0, 50).forEach(k => delete this.cache[key])
    //   return value
    // },

    // /**
    //  * @param {string[] | null} value 
    //  * @returns {string[] | null}
    //  */
    // clone(value) {
    //   return Array.isArray(value) ? value.slice() : value
    // },

    // /**
    //  * converts zhuyin(english) to chinese characters using google input tools
    //  * @param {string} zhuyin input zhuyin that accidently typed in english
    //  * @param {number} count max guesses
    //  * @returns {[string[], number[]]}
    //  */
    // fromZhuyin(zhuyin, count = 3) {
    //   if (!zhuyin) return null
    //   if (typeof count !== 'number' || count < 1 || isNaN(count)) count = 1
    //   if (count > 16) count = 16
    //   const orderres = this.rearrangeZhuyin(zhuyin)
    //   if (!orderres.res) return null
    //   if (this.cacheIndex.includes(orderres.res)) {
    //     if (!this.cache[orderres.res]) return null
    //     return [this.clone(this.cache[orderres.res]), this.cache[orderres.res].map(s => orderres.indexes[s.length - 1])]
    //   }
    //   zhuyin = orderres.res.replaceAll(' ', '=')
    //   const res = Request.get(`https://inputtools.google.com/request?text=${encodeURIComponent(zhuyin.replaceAll(',', '%2C'))}&itc=zh-hant-t-i0-und&num=${count}&ie=utf-8&oe=utf-8&app=minecraft-chat`)
    //   if (res.responseCode !== 200) return null
    //   try {
    //     const json = JSON.parse(res.text())
    //     if (json[0] !== 'SUCCESS') return null
    //     if (json[1][0][1].length === 0) return this.storeCache(orderres.res, null)
    //     return [this.storeCache(orderres.res, json[1][0][1]), json[1][0][1].map(s => orderres.indexes[s.length - 1])]
    //   } catch (e) {}
    //   return null
    // },

    // /**
    //  * rearranges the zhuyin(english) to correct order
    //  * @param {string} zhuyin 
    //  * @returns 
    //  */
    // rearrangeZhuyin(zhuyin) {
    //   let res = ''
    //   const indexes = []
    //   const inp = new Array(3).fill(null)
    //   zhuyin = zhuyin.toLowerCase()
    //   for (let index = 0, char; index < zhuyin.length; index++) {
    //     char = zhuyin[index]
    //     if (' 6347'.includes(char)) {
    //       res += inp.join('') + char
    //       indexes.push(index + 1)
    //       inp.fill(null)
    //     } else if ('1qaz2wsxedcrfv5tgbyhn'.includes(char)) inp[0] = char
    //     else if ('ujm'.includes(char)) inp[1] = char
    //     else if ('8ik,9ol.0p;/-'.includes(char)) inp[2] = char
    //   }
    //   return { res, indexes }
    // }
  },
  { // test: multiple string range is supported
    // /** @type {ChangeListener} */
    // onChange(s, c) {
    //   s = s.slice(0, c)
    //   const res = []
    //   let l = Math.floor(s.length / 4)
    //   while (l > 0) {
    //     res.push(new Suggestion(c - l * 4, c, 'Test'.repeat(l--)))
    //   }
    //   return res
    // }
  },
  { // test: will suggest after picked a suggest
    // /** @type {KeywordListener} */
    // onKeyword(k) {
    //   if (k === 'pos') return 'bpos'
    // }
  }
]

/** @type {OpenChatScreenListener[]} */
const onOpenChatScreens = []
/** @type {ChangeListener[]} */
const onChanges = []
/** @type {KeywordListener[]} */
const onKeywords = []
listeners.forEach(l => {
  if (l.onOpenChatScreen) onOpenChatScreens.push(l.onOpenChatScreen.bind(l))
  if (l.onChange) onChanges.push(l.onChange.bind(l))
  if (l.onKeyword) onKeywords.push(l.onKeyword.bind(l))
})

const StringRange = Java.type('com.mojang.brigadier.context.StringRange')
const mcSuggestion = Java.type('com.mojang.brigadier.suggestion.Suggestion')
const InputSuggestorF  = getF(Java.type('net.minecraft.class_408'),  'field_21616')
const suggestorWindowF = getF(Java.type('net.minecraft.class_4717'), 'field_21612')
const SuggestionWindow = getF(Java.type('net.minecraft.class_4717$class_464').class.getDeclaredConstructors()[0])
const chatFieldF       = getF(Java.type('net.minecraft.class_408'),  'field_2382')
const changedListenerF = getF(Java.type('net.minecraft.class_342'),  'field_2088')

/** @type {(text: string) => number} */
const getTextWidth = Client.getMinecraft().field_1772.method_1727

let currentText = ''

JsMacros.on('OpenScreen', JavaWrapper.methodToJava(e => {
  if (e.screenName !== 'Chat') return
  onOpenChatScreens.forEach(cb => {
    try {
      cb(e.screen)
    } catch (e) { logerr(e) }
  })
  new Promise((res, rej) => {
    e.screen.setOnKeyPressed(JavaWrapper.methodToJava(res))
    e.screen.setOnClose(JavaWrapper.methodToJava(rej))
  }).then(() => {
    if (Hud.getOpenScreenName() !== 'Chat') return
    const screen = Hud.getOpenScreen()
    const input = chatFieldF.get(screen)

    // i sure hope this message won't appear anymore COPIUM
    if (!input) return Chat.log(`[PosFiller err] null input in class ${screen.getClass()}`)
    const composed = changedListenerF.get(input)?.andThen(JavaWrapper.methodToJava(text => {
      triggerSuggest(screen, input, text)
    }))
    
    if (composed) input.method_1863(composed) // input.setChangedListener()
    else Chat.log('[PosFiller err] null composed')
  })
}))

/**
 * @param {IScreen} screen 
 * @param {?} input 
 * @param {string} text 
 */
function triggerSuggest(screen, input, text) {
  currentText = text
  /** @type {number} */
  const cursor = input.method_1881()

  /** @type {Suggestion[]} */
  const res = onChanges.flatMap(cb => {
    try {
      return cb(text, cursor)
    } catch (e) { logerr(e) }
  }).filter(/** @type {Filter<Suggestion>} */ (s => s instanceof Suggestion))
    .filter(s => !s.discard)
  for (const keywordMatch of [
    text.slice(0, cursor).match(/\$?\b(\w+)(\W*)$/),
    (cursor < text.length ? text.match(/\$?\b(\w+)(\W*)$/) : null)
  ]) {
    if (!keywordMatch) continue
    const [, keyword, sym] = keywordMatch
    const kres = onKeywords.flatMap(cb => {
      try {
        return cb(keyword, sym)
      } catch (e) { logerr(e) }
    }).filter(/** @type {Filter<string>} */ (v => typeof v === 'string'))
    if (kres.length) {
      const start = keywordMatch.index ?? 0
      const end = start + keywordMatch[0].length
      res.push(...kres.map(s => new Suggestion(start, end, s)).filter(s => !s.discard))
    }
  }

  if (!res.length) return

  /** @type {JavaList<mcSuggestion>} */
  // @ts-ignore
  const list = new (Java.type('java.util.ArrayList'))()
  /** @type {number} */// @ts-ignore
  const start = res.reduce((p, v) => p < v.start ? p : v.start, Infinity)
  let maxWidth = 0
  res.forEach(s => {
    const sug = text.slice(start, s.start) + s.text
    list.add(new mcSuggestion(StringRange.between(start, s.end), sug))
    const wid = getTextWidth(sug)
    if (wid > maxWidth) maxWidth = wid
  })
  if (!maxWidth) return

  const InputSuggestor = InputSuggestorF.get(screen)
  suggestorWindowF.set(InputSuggestor, SuggestionWindow.newInstance(
    InputSuggestor,
    getTextWidth(text.slice(0, start)) + 4, // x
    screen.getHeight() - 12, // y
    maxWidth,
    list,
    false // narrateFirstSuggestion
  ))
  InputSuggestor.method_23933(true) // .setWindowActive()
}

function logerr(e) {
  Chat.log(e.toString())
}

/**
 * @param {number} start
 * @param {number} end
 * @param {string} text
 */
function Suggestion(start, end, text) {
  this.discard = false
  const discard = (/** @type {string} */ msg) => {
    if (msg != null) Chat.log(`[PosFiller] ${msg}`)
    this.discard = true
  }
  if (typeof start !== 'number') return discard(`wrong type on start (${start})`)
  if (typeof end   !== 'number') return discard(`wrong type on end (${end})`)
  if (typeof text  !== 'string') return discard(`wrong type on text (${text})`)
  if (start < 0 || start >= currentText.length) return discard(`invalid range of start (${start})`)
  if (end < 0 || end > currentText.length) return discard(`invalid range of end (${end})`)
  /** @type {number} */ this.start = start
  /** @type {number} */ this.end = end
  /** @type {string} */ this.text = text
}

/**
 * @template {JavaClassArg | AccessibleObject} T
 * @param {T} f 
 * @param {T extends JavaClassArg ? string : undefined} [name] 
 * @returns {T extends JavaClassArg ? Field : T}
 */
function getF(f, name) {
  if (name) f = Reflection.getDeclaredField(f, name)
  f.setAccessible(true)
  return f
}

/**
 * @typedef {object} SuggestingListener
 * @property {OpenChatScreenListener} [onOpenChatScreen]
 *  might call 2 times with optifine installed, not sure
 * @property {ChangeListener} [onChange]
 * @property {KeywordListener} [onKeyword]
 */

/**
 * @typedef {(screen: IScreen) => void} OpenChatScreenListener
 * @typedef {(text: string, cursor: number) => void | Suggestion | Suggestion[]} ChangeListener
 * @typedef {(keyword: string, symbols: string) => void | string | string[]} KeywordListener
 */

/**
 * @typedef {Packages.xyz.wagyourtail.jsmacros.client.api.sharedinterfaces.IScreen} IScreen
 * @typedef {Packages.com.mojang.brigadier.suggestion.Suggestion} mcSuggestion
 * @typedef {Packages.java.lang.reflect.Field} Field
 * @typedef {Packages.java.lang.reflect.AccessibleObject} AccessibleObject
 */

module.exports = {}
