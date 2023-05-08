
// able to obtain regen II beacon
// usage:
//   prepare a level 4 not configured beacon and an activate item
//   look at beacon, run this script
//   put the item in and click ok, just like usual
// is key script

Player.getPlayer().interact()
const to = Time.time() + 5000 // Timeout
while (!Hud.isContainer() && Time.time() < to) Client.waitTick()
if (Hud.isContainer())
Player.openInventory().selectSecondEffect('minecraft:regeneration')

module.exports = {}
