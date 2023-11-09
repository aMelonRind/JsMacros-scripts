
// able to obtain regen II beacon
// usage:
//   prepare a level 4 beacon and an activate item
//   look at beacon, run this script
//   put the item in and click ok, just like usual
// is key script
module.exports = 0

Player.getInteractionManager().interact()
const to = Time.time() + 5000 // Timeout
while (!Hud.isContainer() && Time.time() < to) Client.waitTick()
if (Hud.isContainer()) {
  const inv = Player.openInventory()
  inv.getRawContainer().jsmacros_setPrimaryEffect(null)
  inv.selectSecondEffect('minecraft:regeneration')
}
