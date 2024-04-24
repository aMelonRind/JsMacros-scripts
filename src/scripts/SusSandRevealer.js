//@ts-check
// reveals the content of a suspicious block.
JsMacros.assertEvent(event, 'Service')
module.exports = 0

const { createTooltip } = require('../lib/TooltipElement')
const ItemStack = Java.type('net.minecraft.class_1799')

const d2d = Hud.createDraw2D().setVisible(false)

const item = d2d.addItem(0, 0, 'minecraft:air')
const tt = createTooltip(0, 0)

d2d.setOnInit(JavaWrapper.methodToJava(() => {
  const cx = Math.floor(d2d.getWidth() / 2)
  const cy = Math.floor(d2d.getHeight() * 0.6)

  item.setPos(cx - 12, cy - 12)
  tt.setPos(cx, cy)
  d2d.reAddElement(item)
  tt.addTo(d2d)
}))

d2d.register()

/** @type {BlockPosHelper?} */
let lastCheck = null

JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
  const target = Player.getInteractionManager()?.getTargetedBlock()
  if (target?.equals(lastCheck)) return
  lastCheck = null
  d2d.setVisible(false)
  if (!target) return
  const block = World.getBlock(target)
  if (!block) return
  const id = block.getId()
  if (id !== 'minecraft:suspicious_sand' && id !== 'minecraft:suspicious_gravel') {
    lastCheck = target
    return
  }
  let nbt = block.getNBT()?.get('item')
  if (!nbt?.isCompound() || nbt.get('id')?.asString() === 'minecraft:air') return
  lastCheck = target
  const raw = ItemStack.method_7915(nbt.getRaw()) // .fromNbt()
  item.item = raw
  tt.raw.tooltipItem = raw
  d2d.setVisible(true)
}))

event.stopListener = JavaWrapper.methodToJava(() => {
  d2d.unregister()
})