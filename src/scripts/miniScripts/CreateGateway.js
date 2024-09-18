// can create an end gateway for current position
// requires fabric and creative mode or /give command permission
module.exports = 0

const pos = Player.getPlayer().getPos()
const x = Math.floor(pos.getX())
const y = Math.floor(pos.getY() + 0.2)
const z = Math.floor(pos.getZ())
const cmd = `setblock ~ ~ ~ end_gateway{ExactTeleport:1,exit_portal:[I;${x},${y},${z}]}`
const name = `{"text":"Gateway to ${x}, ${y}, ${z}","italic":false}`
const lore = `{"text":"Destination: ${x}, ${y}, ${z}","italic":false}`
const snbt = `{BlockEntityTag:{Command:'${cmd}',auto:1},display:{Name:'${name}',Lore:['${lore}']}}`
const components = `[block_entity_data={id:'',Command:'${cmd}',auto:1},item_name='${name}',lore=['${lore}']]`

try {
  if (Player.getGameMode() !== 'creative') throw null
  const inv = Player.openInventory()
  const slot = inv.getMap().hotbar[inv.getSelectedHotbarSlotIndex()]
  if (!inv.getSlot(slot).isEmpty()) throw null
  const StringNbtReader = Java.type('net.minecraft.class_2522')
  const ItemStack = Java.type('net.minecraft.class_1799')
  const CreativeInventoryActionC2SPacket = Java.type('net.minecraft.class_2873')
  const item = ItemStack.method_7915(StringNbtReader.method_10718(`{
    id: "minecraft:command_block",
    Count: 1b,
    tag: ${snbt}
  }`)) // ItemStack.fromNbt(StringNbtReader.parse(snbt))
  Client.getMinecraft().method_1562().method_2883(new CreativeInventoryActionC2SPacket(slot - 9, item))
} catch (e) {
  const version = Client.mcVersion().split('.')
  const minor = parseInt(version[1]) || 0
  const patch = parseInt(version[2]) || 0
  Chat.say(`/give @s command_block${minor > 20 || minor === 20 && patch >= 5 ? components : snbt}`)
}
