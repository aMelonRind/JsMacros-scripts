//@ts-check
// this script is shared as an example of how to use ServerUtils
JsMacros.assertEvent(event, 'Service')
module.exports = 0

// if (!World.isWorldLoaded())
//   JsMacros.waitForEvent('ChunkLoad')

const { ServerUtils, addUiUtilToggleButton } = require('../lib/ServerUtils.js')

const su = new ServerUtils()
// const logger = require('../lib/Logger.js')
const filters = JsMacros.eventFilters()

// const ip = 'Brilliantw.net'

const trusted = new Set([
  'MelonRind',
  // ...removed contents
])

su.addButton('/bp').setIcon('chest').says('/bp').build()
// su.addButton('/ec').setIcon('ender_chest').says('/ec').build()
su.addButton('/top').setIcon('shulker_shell').says('/top').build()
su.addButton('/home home').setIcon('oak_door').says('/home home').build()
addUiUtilToggleButton(su)
su.addButton('copy nbt').setIcon('filled_map').runs(() => {
  const snbt = Player.getPlayer()?.getMainHand().getNBT()?.asString()
  if (snbt) {
    Utils.copyToClipboard(snbt)
  }
}).build()

su.autoAcceptTpa(/^｜系統｜飯娘：(\w+) 請求傳送過來。$/, '/tpyes', trusted)
// .autoAcceptTpa(/^｜系統｜飯娘：(\w+) 請求傳送過去。$/, '/tpyes', trusted)
.allowRemoteCommand(/^｜私訊｜[^｜]+｜(\w+) -> 我： run (\/.+)$/, trusted)
.blockMessages(
  '｜系統｜飯娘：輸入 /sort 即可開啟自動整理容器內容物。'
)

const signinNotif = new Set([
  '｜系統｜飯娘：您今天還沒有簽到！[點擊此處打開簽到界面]',
  '｜系統｜飯娘：您今天還沒有簽到! [點擊此處打開簽到界面]'
])
su.addRecvMessageListener(str => {
  if (signinNotif.has(str.replaceAll(/^\u00a7\w$/g, ''))) {
    Chat.say('/signin click')
  }
})


// region block spam message
const spamBlocklist = new Set([
  'ꅎ支持輝煌伺服器繼續運營下去！開設伺服器都需要資金來維持伺服器的運營，或者購買更好的配備來提升玩家的遊戲體驗，而且輝煌的 永久領地飛行 僅要 470 新台幣，相當實惠，不考慮考慮，小額贊助一下嗎？（更多福利可參考 「贊助說明超連結」 之說明。）',
  '請玩家務必將個人資產設置 領地、鎖牌 ！本服的 服規 大多數時候僅保障 有 設領地、鎖牌 的玩家，但不意味著你可以 毫無忌憚 的 破壞與偷竊 未設置領地、鎖牌的地區，最好就是 不要破壞與偷竊 ，那就 不會有違規疑慮 。',
  '一個人玩輝煌應該挺無聊的 ... 所以，嘗試揪朋友一起來玩吧！輝煌是一個適合一團人聚在一起嗨的伺服器，提供了大量遊戲功能，有關於功能教學可參考 /menu 之介紹。或查看官網：「點擊此文字以查看伺服器官網教學」',
  'ꆚ 水芥商城現已開放！在這裡玩家可以購買到部分的贊助者限定福利，例如：隨身背包欄位、快捷功能方塊 ... 等等立即購買 -> /wshop'
])
let spamBuffering = false
let spamCd = 5
/** @type {JavaList<TextHelper>} */
const spamBuffer = JavaUtils.createArrayList()
const spamSummarizer = JavaWrapper.methodToJavaAsync(() => {
  while (spamBuffering && spamCd-- > 0) {
    Client.waitTick()
  }
  spamBuffering = false
  if (spamBlocklist.has(spamBuffer.slice(2, -2).map(t => t.getString().trim()).join(''))) {
    // logger.log('Blocked spam.')
    spamBuffer.clear()
    return
  }
  const builder = Chat.createTextBuilder()
  let first = true
  for (const txt of spamBuffer) {
    if (first) {
      first = false
    } else {
      builder.append('\n')
    }
    if (txt.getString() === '▬'.repeat(80)) {
      builder.append('§r')
    }
    builder.append(txt)
  }
  spamBuffer.clear()
  Chat.log(builder.build())
})
su.addRecvMessageListener((str, e) => {
  const txt = e.text
  if (!txt) return
  const isSpamBorder = str === '▬'.repeat(80)
  if (!spamBuffering) {
    if (isSpamBorder) {
      e.cancel()
      spamBuffering = true
      spamCd = 5
      spamSummarizer.run()
      spamBuffer.clear()
      spamBuffer.add(txt)
    }
  } else {
    e.cancel()
    spamBuffer.add(txt)
    if (isSpamBorder) {
      spamBuffering = false
    } else {
      spamCd = 5
    }
  }
}, true)


// region Death close button
const DeathScreen = 'net.minecraft.class_418'
JsMacros.on('OpenScreen', filters.composed(filters.compile('OpenScreen', `event.screen instanceof ${DeathScreen}`)), JavaWrapper.methodToJava(e => {
  e.screen?.addButton(50, 50, 60, 20, 'close', JavaWrapper.methodToJava(() => {
    Hud.openScreen(null)
  }))
}))
