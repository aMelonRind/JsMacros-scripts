
type _ = { [none: symbol]: undefined } // to trick vscode to rename types

type Dict<K = string, V = number> = { [P in K]?: V }

type Context = EventContainer
type EventCallback<E, R = void> = (event: JsmEvents[E], context: Context) => R
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
  async quick      (slot:  number): Promise<AsyncInventory>
  async click      (slot:  number): Promise<AsyncInventory>
  async grabAll    (slot:  number): Promise<AsyncInventory>
  async dropSlot   (slot:  number): Promise<AsyncInventory>
  async swap       (slot1: number, slot2: number): Promise<AsyncInventory>
  async split      (slot1: number, slot2: number): Promise<AsyncInventory>
  async swapHotbar (slot1: number, slot2: number): Promise<AsyncInventory>
  async click      (slot:  number,   mousebutton: Bit): Promise<AsyncInventory>
  async dragClick  (slots: number[], mousebutton: Bit): Promise<AsyncInventory>
  /** @alias util.container.waitInterval */
  async waitInterval<R>(cb: () => R): Promise<R | undefined>
}

type Recipe = {
  on: string
  type: string
  id: string
  info: {
    input: Dict
    output: string
    count: number
  }
  weight: Dict
}
