// can create an end gateway for current position
// requires fabric and creative mode or /give command permission
module.exports = 0

const pos = Player.getPlayer().getPos()
const x = Math.floor(pos.getX())
const y = Math.floor(pos.getY() + 0.2)
const z = Math.floor(pos.getZ())
const snbt = `{
  BlockEntityTag: {
    Command: "setblock ~ ~ ~ end_gateway{ExactTeleport:1,ExitPortal:{X:${x},Y:${y},Z:${z}}}",
    auto: 1b
  },
  display: {
    Name: '{"text":"Gateway to ${x}, ${y}, ${z}","italic":false}',
    Lore: [
      '{"text":"Destination: ${x}, ${y}, ${z}","italic":false}'
    ]
  }
}`.replaceAll(/\n\s*(?:(\w+:) )?/g, '$1')

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
  Chat.say(`/give @s command_block${snbt}`)
}
