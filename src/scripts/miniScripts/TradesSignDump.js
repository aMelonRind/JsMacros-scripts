//@ts-check
// dumps villager enchantment trades to sign
JsMacros.assertEvent(event, 'Service')
module.exports = 0

const logger = require('../../lib/Logger')

/** @type {string[]} */
let lines = []

JsMacros.on('OpenContainer', JavaWrapper.methodToJava(e => {
  const inv = e.inventory
  if (!inv.is('Villager')) return
  if (!Player.getPlayer()?.getMainHand().getItemId().endsWith('_sign')) return
  for (let i = 0; i < 10; i++) {
    Client.waitTick()
    if (inv.getTrades().size() >= 2) break
  }
  const enchantments = []
  for (const t of inv.getTrades()) {
    const item = t.getOutput()
    if (item.getItemId() !== 'minecraft:enchanted_book') continue
    /** @type {JavaList<NBTElementHelper$NBTCompoundHelper>?} *///@ts-ignore
    const list = item.getNBT()?.resolve('"minecraft:custom_data".StoredEnchantments[{}]')
    if (!list || list.isEmpty()) continue
    for (const nbt of list) {
      const id = nbt.get('id')?.asString()
      const lvl = nbt.get('lvl')?.asNumberHelper().asNumber()
      if (!id || !lvl) continue
      enchantments.push(format(id, lvl))
    }
  }
  if (!enchantments.length) {
    logger.log('nothing to dump')
    lines.length = 0
  } else {
    if (enchantments.length <= 4) {
      lines = enchantments
    } else {
      // max width 90
      lines.length = 0
      let res = ''
      for (const e of enchantments) {
        const temp = res ? `${res}, ${e}` : e
        if (Chat.getTextWidth(temp) <= 90) {
          res = temp
        } else {
          lines.push(res)
          res = e
        }
      }
      if (res) {
        lines.push(res)
      }
    }
    logger.log(`dumped ${enchantments.length} enchantments${lines.length > 4 ? ` (exceeded ${lines.length - 4} lines)` : ''}`)
  }
  inv.close()
}))

JsMacros.on('SignEdit', true, JavaWrapper.methodToJava(e => {
  if (!lines.length) return
  const signText = e.signText
  if (!signText || signText.some(v => v)) return
  e.cancel()
  lines.slice(0, 4).forEach((l, i) => {
    signText[i] = l
  })
}))

/**
 * @param {string} id 
 * @param {number} lvl 
 * @returns {string}
 */
function format(id, lvl) {
  let res = ''
  const words = id.split(':').at(-1)?.split('_') ?? ['err']
  res = `${words.shift()?.slice(0, 4)}`
  for (const w of words) res += w[0].toUpperCase()
  return `${res} ${lvl}`
}
