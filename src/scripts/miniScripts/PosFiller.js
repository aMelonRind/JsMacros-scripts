
/*
 * to fill coords in the chat, customizable
 * keywords:
 *  pos: player block pos
 *  bpos: looking at block pos
 * add a comma (,) to separate with comma
 * 
 * is service script
 */

let block
/** @type {SuggestingListener[]} */
const listeners = [
  { // bpos
    onOpenChatScreen() {
      block = Player.rayTraceBlock(8, false)
    },
    onKeyword(keyword, sym) {
      if (keyword !== 'bpos') return
      if (!(block ||= Player.rayTraceBlock(8, false))) return
      if (sym === ',') return `${block.getX()}, ${block.getY()}, ${block.getZ()}`
      if (sym === '')  return `${block.getX()} ${block.getY()} ${block.getZ()} `
    }
  },
  { // pos
    onKeyword(keyword, sym) {
      if (keyword !== 'pos') return
      const {x, y, z} = Player.getPlayer().getBlockPos() // add .toPos3D() in 1.8.4
      if (sym === ',') return `${x}, ${y}, ${z}`
      if (sym === '')  return `${x} ${y} ${z} `
    }
  },
  { // caps convert to lower case
    onChange(text, cursor) {
      text = text.slice(0, cursor)
      if (/[A-Z]/.test(text) && /^[A-Z ,.!?]+$/.test(text))
        return new Suggestion(0, cursor, text.toLowerCase())
    }
  },
  // { // test: multiple string range is supported
  //   onChange(s, c) {
  //     s = s.slice(0, c)
  //     const res = []
  //     let l = Math.floor(s.length / 4)
  //     while (l > 0) {
  //       res.push(new Suggestion(c - l * 4, c, 'Test'.repeat(l--)))
  //     }
  //     return res
  //   }
  // },
  // { // test: will suggest after picked a suggest
  //   onKeyword(k) {
  //     if (k === 'pos') return 'bpos'
  //   }
  // }
]

/** @type {OpenChatScreenListener[]} */
const onOpenChatScreens = []
/** @type {ChangeListener[]} */
const onChanges = []
/** @type {KeywordListener[]} */
const onKeywords = []
listeners.forEach(l => {
  if ('onOpenChatScreen' in l) onOpenChatScreens.push(l.onOpenChatScreen)
  if ('onChange' in l) onChanges.push(l.onChange)
  if ('onKeyword' in l) onKeywords.push(l.onKeyword)
})

const StringRange = Java.type('com.mojang.brigadier.context.StringRange')
const mcSuggestion = Java.type('com.mojang.brigadier.suggestion.Suggestion')
const InputSuggestorF  = getF(Reflection.getClass('net.minecraft.class_408'),  'field_21616')
const suggestorWindowF = getF(Reflection.getClass('net.minecraft.class_4717'), 'field_21612')
const SuggestionWindow = getF(Reflection.getClass('net.minecraft.class_4717$class_464').getDeclaredConstructors()[0])
const chatFieldF       = getF(Reflection.getClass('net.minecraft.class_408'),  'field_2382')
const changedListenerF = getF(Reflection.getClass('net.minecraft.class_342'),  'field_2088')

/** @type {(text: string) => number} */
const getTextWidth = Client.getMinecraft().field_1772.method_1727

let currentText = ''

JsMacros.on('OpenScreen', JavaWrapper.methodToJava(e => {
  if (e.screenName !== 'Chat') return
  onOpenChatScreens.forEach(cb => cb(e.screen))
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
 * 
 * @param {IScreen} screen 
 * @param {?} input 
 * @param {string} text 
 */
function triggerSuggest(screen, input, text) {
  currentText = text
  const cursor = input.method_1881()
  const keywordMatch = text.slice(0, cursor).match(/\$?\b(\w+)(\W*)$/)

  /** @type {Suggestion[]} */
  const res = onChanges.flatMap(cb => cb(text, cursor))
    .filter(s => s instanceof Suggestion)
    .filter(s => !s.discard)
  if (keywordMatch) {
    const [, keyword, sym] = keywordMatch
    const kres = onKeywords.flatMap(cb => cb(keyword, sym))
      .filter(v => typeof v === 'string')
    if (kres.length) {
      const start = keywordMatch.index
      const end = start + keywordMatch[0].length
      res.push(...kres.map(s => new Suggestion(start, end, s)).filter(s => !s.discard))
    }
  }

  if (!res.length) return

  /** @type {JavaList<mcSuggestion>} */
  const list = new (Java.type('java.util.ArrayList'))()
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

/**
 * @param {number} start
 * @param {number} end
 * @param {string} text
 */
function Suggestion(start, end, text) {
  const discard = (msg) => {
    if (msg != null) Chat.log(`[PosFiller] ${msg}`)
    this.discard = true
  }
  if (typeof start !== 'number') return discard(`wrong type on start (${start})`)
  if (typeof end   !== 'number') return discard(`wrong type on end (${end})`)
  if (typeof text  !== 'string') return discard(`wrong type on text (${text})`)
  if (start < 0 || start >= currentText.length) return discard(`invalid range of start (${start})`)
  if (end < 0 || end > currentText.length) return discard(`invalid range of end (${end})`)
  this.start = start
  this.end = end
  this.text = text
}

/**
 * @template {JavaClass | { setAccessible(arg: boolean): void }} T
 * @param {T} f 
 * @param {T extends JavaClass ? string : undefined} name 
 * @returns {T extends JavaClass ? Field : T}
 */
function getF(f, name) {
  if (name) f = f.getDeclaredField(name)
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
 */

module.exports = {}
