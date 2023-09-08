// @ts-check
const DataManager = require('../modules/DataManager')

const filenameRegex = /^[^\\\/:*?"<>|\r\n]+$(?<!\.$)/
const title1 = Chat.createTextHelperFromString('Enter a name for this world/server')
const title2 = Chat.createTextHelperFromString('the name should be a valid directory name')

const invalidNameLabel = Chat.createTextBuilder().append('Confirm').withColor(0xc).build()
const duplicateNameLabel = Chat.createTextBuilder().append('Confirm').withColor(0x6).build()
const validNameLabel = Chat.createTextBuilder().append('Confirm').withColor(0xa).build()

const invalidNameTooltip = [
  'Invalid Name',
  'The name should be a valid directory name',
  "It cannot end with '.' and cannot contain following characters:",
  ' \\ / : * ? " < > |'
]
const duplicateNameTooltip = [
  'Duplicate Name',
  'The name is already set for another server',
  "You can still set it, they'll share the same profile"
]
const confirmDuplicateNameTooltip = [
  'Duplicate Name',
  'The name is already set for another server',
  "You can still set it, they'll share the same profile",
  '',
  'Click again to confirm'
]
const validNameTooltip = [
  'Valid Name',
  'Click to confirm'
]

class NameAssignmentScreen {

  /**
   * @param {IScreen?} parent
   * @param {string} worldId 
   * @param {(() => void)?} onClose 
   */
  static open(parent, worldId, onClose = null) {
    const screen = Hud.createScreen('Assign a Name', false)
    screen.setParent(parent)
    if (onClose) screen.setOnClose(JavaWrapper.methodToJava(onClose))
    const label = Chat.createTextBuilder().append(`World Identifier: ${worldId}`).withColor(0x8).build()

    screen.setOnInit(JavaWrapper.methodToJava(s => {
      const cx = Math.floor(s.getWidth() / 2)
      const cy = Math.floor(s.getHeight() / 2)
      s.addText(title1, cx - Math.floor(title1.getWidth() / 2), cy - 48, 0xFFFFFF, true)
      s.addText(title2, cx - Math.floor(title2.getWidth() / 2), cy - 38, 0xFFFFFF, true)
      s.addText(label,  cx - Math.floor( label.getWidth() / 2), cy - 28, 0xFFFFFF, true)
      let name = ''
      let state = 0
      const btn = s.addButton(cx - 30, cy + 16, 60, 20, 'Confirm', JavaWrapper.methodToJava(() => {
        if (state === 1) {
          btn.setLabel(duplicateNameLabel)
          btn.setTooltip(confirmDuplicateNameTooltip)
          state = 2
        } else if (state === 2 || state === 3) {
          DataManager.setProfileIndex(worldId, name)
          screen.close()
        }
      }))
      btn.setLabel(invalidNameLabel)
      const input = s.addTextInput(
        cx - Math.min(80, cx - 10),
        cy - 8,
        Math.max(Math.min(80, cx - 10), 10) * 2,
        16,
        'storage name input',
        JavaWrapper.methodToJava(str => {
          if (!str || !filenameRegex.test(str)) {
            btn.setLabel(invalidNameLabel)
            btn.setTooltip(invalidNameTooltip)
            name = 'invalid'
            state = 0
          } else if (DataManager.hasProfile(str)) {
            btn.setLabel(duplicateNameLabel)
            btn.setTooltip(duplicateNameTooltip)
            name = str
            state = 1
          } else {
            btn.setLabel(validNameLabel)
            btn.setTooltip(validNameTooltip)
            name = str
            state = 3
          }
        })
      )
      if (worldId.startsWith('LOCAL_')) input.setText(worldId.slice(6), true)
      else if (/^\w$/.test(worldId[0])) {
        let inferred = worldId.split(':')[0]
        if (inferred.includes('.')) inferred = inferred.split('.', 3).at(-2) ?? 'name'
        inferred = inferred[0].toUpperCase() + inferred.slice(1)
        input.setText(inferred, true)
      }
      // screen.setFocused(input)
    }))
    Hud.openScreen(screen)
  }

}

module.exports = NameAssignmentScreen
