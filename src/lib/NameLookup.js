//@ts-check

/** @type {() => Record<string, ItemId>} */
const exceptionsSupplier = () => ({
  '火藥粉': 'minecraft:gunpowder'
})

/** @type {Record<string, string>} */
const table = getReverseItemLookup()
for (const key in table) {
  if (table[key]?.startsWith('minecraft:')) table[key] = table[key].slice(10)
  else delete table[key]
}

const exp = {

  /**
   * @returns {ItemId?}
   */
  lookup(name = '') {
    const res = table[name]
    //@ts-ignore
    return res ? `minecraft:${res}` : null
  }

}

module.exports = exp

/**
 * @returns {Record<string, ItemId>}
 */
function getReverseItemLookup() {
  const lang = getDefaultLangJson('zh_tw')
  if (!lang) throw `can't get default language file`
  const res = exceptionsSupplier()
  for (const key in lang) {
    if (!key.startsWith('item.minecraft.')) continue
    insert(lang[key], key.slice('item.minecraft.'.length))
  }
  for (const key in lang) {
    if (!key.startsWith('block.minecraft.')) continue
    insert(lang[key], key.slice('block.minecraft.'.length))
  }
  /**
   * @param {string} text 
   * @param {string} omittedId 
   */
  function insert(text, omittedId) {
    /** @type {ItemId} *///@ts-ignore
    const fullId = 'minecraft:' + omittedId
    res[text] ??= fullId
    if (text.includes(' ')) {
      const spaceLess = text.replace(/ /g, '')
      res[spaceLess] ??= fullId
    }
  }
  return res
}

/**
 * @param {string} lang 
 * @returns {Record<string, string>?}
 */
function getDefaultLangJson(lang = 'en_us') {
  const Identifier = Java.type('net.minecraft.class_2960')
  const assetsType = Java.type('net.minecraft.class_3264').field_14188
  
  /** @type {(() => Packages.java.io.InputStream)?} */
  const supplier = Client.getMinecraft().method_45573().method_14405(assetsType, new Identifier(`minecraft:lang/${lang.replace(/-/g, '_')}.json`))
  // .getDefaultResourcePack().open()
  if (!supplier) return null
  const is = supplier()
  /** @type {string} *///@ts-ignore
  const str = new java.lang.String(is.readAllBytes(), 'utf-8')
  is.close()
  return JSON.parse(str)
}
