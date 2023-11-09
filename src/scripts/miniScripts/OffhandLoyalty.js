
// make loyalty trident come back to offhand if thrown by offhand
JsMacros.assertEvent(event, 'Service')
module.exports = 0

/** @type {ItemStackHelper=} */
let heldTrident = undefined
if (Player.getPlayer().getOffHand().getItemId() === 'minecraft:trident') heldTrident = Player.getPlayer().getOffHand()

JsMacros.on('HeldItemChange', JavaWrapper.methodToJava(e => {
  if (!e.offHand) return
  if (e.item.getItemId() === 'minecraft:trident') heldTrident = e.item
  else if (!e.item.isEmpty()) heldTrident = undefined
}))

JsMacros.on('EntityUnload', JavaWrapper.methodToJava(e => {
  if (!heldTrident) return
  if (e.entity.getType() !== 'minecraft:trident') return
  if (!Player.getPlayer().getOffHand().isEmpty()) return
  if (e.entity.getNBT().asCompoundHelper().get('Owner')?.asListHelper().asUUID().toString() !== Player.getPlayer().getUUID()) return

  if (!holdIt()) {
    Client.waitTick()
    holdIt()
  }
}))

function holdIt() {
  const heldNbt = heldTrident.getNBT()?.toString().replace(/Damage:\d+/g, '')
  const inv = Player.openInventory()
  const slot = Java.from(inv.getMap().hotbar).concat(inv.getMap().main ?? [])
    .find(slot => {
      const item = inv.getSlot(slot)
      if (item.getItemId() !== 'minecraft:trident') return
      // for some reason .isItemEqualIgnoreDamage() won't work so...
      // (i tried raw method as well)
      return item.getNBT()?.toString().replace(/Damage:\d+/g, '') === heldNbt
    })
  if (slot === undefined) return false
  inv.swapHotbar(slot, 40)
  return true
}
