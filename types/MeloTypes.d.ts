
type Dict<K extends keyof any = string, V = number> = { [P in K]?: V }

type Context = EventContainer
type EventCallback<E extends keyof Events, R = void> = (event: Events[E], context: Context) => R
type ClientPlayer = ClientPlayerEntityHelper

type Vec3DLike = Vec3D | number[] | number[][]
type Pos3DLike = Pos3D | number[] | Record<'x' | 'y' | 'z', number> |
  Record<'getX' | 'getY' | 'getZ', () => number>

/** you can also treat {@link AsyncInventory} and {@link Inventory} as InfoInventory */
type InfoInventory = Omit<Inventory, keyof _PromisfiedInvMethods |
  'close' | 'closeAndDrop' | 'openGui' | 'quickAll'>

type AsyncInventory = Omit<Inventory, keyof _PromisfiedInvMethods> & _PromisfiedInvMethods

type _PromisfiedInvMethods = {
  /** get the raw Inventory (the one without async) */
  readonly raw:  Inventory
  /** @alias raw */
  readonly sync: Inventory
  quick      (slot:  number): Promise<AsyncInventory>
  click      (slot:  number): Promise<AsyncInventory>
  grabAll    (slot:  number): Promise<AsyncInventory>
  dropSlot   (slot:  number): Promise<AsyncInventory>
  swap       (slot1: number, slot2: number): Promise<AsyncInventory>
  split      (slot1: number, slot2: number): Promise<AsyncInventory>
  swapHotbar (slot1: number, slot2: number): Promise<AsyncInventory>
  click      (slot:  number,   mousebutton: Bit): Promise<AsyncInventory>
  dragClick  (slots: number[], mousebutton: Bit): Promise<AsyncInventory>
  /** @alias util.container.waitInterval */
  waitInterval<R>(cb: () => R): Promise<R | undefined>
}

interface Recipe {
  on: 'crafting_table'
  type: 'recipe_book' | 'macro'
  info: {
    input: Dict<ItemId>
    output: ItemId
    count: number
  }
  weight?: Dict<ItemId>
}

interface RecipeBookRecipe extends Recipe {
  id: RecipeId
}

interface MacroRecipe extends Recipe {
}
