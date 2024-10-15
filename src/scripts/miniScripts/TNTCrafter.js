//@ts-check
// simple script that crafts tnt.
// 1. prepare a lot of dropped items of sand and gunpowder
// 2. make sure there's at least one stack of gunpowder, sand and tnt
// 3. look at a crafting table
// 4. trigger this script
JsMacros.assertEvent(event, 'Key')
module.exports = 0

const allowed = new Set(['tnt', 'sand', 'gunpowder'].map(v => `minecraft:${v}`))

function main() {
  const im = Utils.requireNonNull(Player.interactions())
  const bpos = im.getTargetedBlock()
  if (!bpos || World.getBlock(bpos)?.getId() !== 'minecraft:crafting_table') return
  im.interact()
  Client.waitTick(10)
  const inv = Player.openInventory()
  if (!inv.is('Crafting Table')) return
  const grid = inv.getSlots('input')
  const out = inv.getMap().output?.at(0)
  const allSlots = new Set(inv.getSlots('main', 'hotbar').filter(slot => {
    const item = inv.getSlot(slot)
    return item.isEmpty() || allowed.has(item.getItemId())
  }))
  if (grid.length !== 9 || out == null || allSlots.size < 3) return
  function check(n = 3) {
    Client.waitTick(n)
    return Hud.getOpenScreen() === inv.getRawContainer()
  }
  while (check()) {
    if (!inv.getHeld().isEmpty()) { // illegal state, dump item
      inv.click(-999)
      continue
    }
    const next = grid.findIndex(slot => inv.getSlot(slot).getCount() < 32)
    if (next >= 0) { // fill ingredients
      if (next === 0 && grid.every(s => inv.getSlot(s).isEmpty()) && (
          inv.findItem('minecraft:gunpowder').length > 5
          && inv.findItem('minecraft:sand').length > 4
          || inv.findItem('minecraft:air').filter(s => allSlots.has(s)).length > 2
        )) { // attempt to use recipe book
        const r = inv.getCraftableRecipes().find(r => r.getId() === 'minecraft:tnt')
        if (r) {
          r.craft(true)
          continue
        }
      }
      const id = (next & 1) ? 'minecraft:sand' : 'minecraft:gunpowder'
      const current = inv.getSlot(grid[next])
      if (!current.isEmpty() && current.getItemId() !== id) { // if the ingredient in the input is wrong, drop it
        inv.dropSlot(grid[next], true)
        continue
      }
      const slots = inv.findItem(id).filter(slot => allSlots.has(slot))
      if (slots.length > 1 || slots.length === 1 && inv.getSlot(slots[0]).getCount() < 64) {
        const others = inv.findItem((next & 1) ? 'minecraft:gunpowder' : 'minecraft:sand').filter(slot => allSlots.has(slot)).sort((a, b) => {
          const ai = inv.getSlot(a).getCount() % 32 === 0
          const bi = inv.getSlot(b).getCount() % 32 === 0
          return ai === bi ? 0 : (ai ? -1 : 1)
        })
        if (others.length === 1 && inv.getSlot(others[0]).getCount() === 64) {
          // make space for the other ingredient to speed up crafting
          inv.click(others[0], 1)
          if (!check()) break
          inv.click(slots[0])
          if (!check()) break
          inv.click(grid[next])
          if (!inv.getHeld().isEmpty() && next <= 6 && inv.getSlot(grid[next + 2]).getCount() < 64) {
            // fill further slot to avoid throwing it away
            if (!check()) break
            inv.click(grid[next + 2])
          }
          continue
        }
        // if there's multiple stacks of the ingredient, don't need to preserve it
        inv.quick(slots[0])
        if (next < 8) { // retrieve overflow items
          const overflow = inv.getSlot(grid[next + 1])
          if (overflow.getItemId() === id) inv.quick(grid[next + 1])
        }
      } else if (slots.length === 1) { // preserve half of it to pick up more
        inv.click(slots[0], 1)
        if (!check()) break
        inv.click(grid[next])
      } else break
    } else { // prepare to take result
      if (inv.findFreeInventorySlot() !== -1) {
        inv.quick(out)
        continue
      }
      const tntslot = inv.findItem('minecraft:tnt').filter(slot => allSlots.has(slot)).at(-1)
      if (tntslot == null) break
      const item = inv.getSlot(tntslot)
      if (item.getCount() > 32) { // if the stack of tnt in inventory is too much, throw half of it
        inv.click(tntslot, 1)
        if (!check()) break
        inv.click(-999)
        continue
      }
      if (inv.getSlot(out).getItemId() !== 'minecraft:tnt' && !check()) break
      if (inv.getSlot(out).getItemId() !== 'minecraft:tnt') break
      inv.quick(out)
    }
  }
}

main()
