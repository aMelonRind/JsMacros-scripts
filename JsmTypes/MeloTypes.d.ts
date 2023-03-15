
type _ = { [none: symbol]: undefined } // to trick vscode to rename types

type Dict = { [id: string]: number }
type Context = EventContainer<any>
type EventCallback<E, R = void> = (event: JsmEvents[E], context: Context) => R
type ClientPlayer = ClientPlayerEntityHelper<any>

type Vec3DLike = Vec3D | number[] | number[][]
type Pos3DLike = Pos3D | number[] | Record<'x' | 'y' | 'z', number> |
  Record<'getX' | 'getY' | 'getZ', () => number>

type InfoInventory = Omit<Inventory<any>, keyof _PromisfiedInvMethods |
  'close' | 'closeAndDrop' | 'openGui' | 'quickAll'>

type AsyncInventory = Omit<Inventory<any>, keyof _PromisfiedInvMethods> & _PromisfiedInvMethods

type _PromisfiedInvMethods = {
  readonly raw:  Inventory<any>
  readonly sync: Inventory<any>
  async quick      (slot:  number): Promise<AsyncInventory>
  async click      (slot:  number): Promise<AsyncInventory>
  async grabAll    (slot:  number): Promise<AsyncInventory>
  async dropSlot   (slot:  number): Promise<AsyncInventory>
  async swap       (slot1: number, slot2: number): Promise<AsyncInventory>
  async split      (slot1: number, slot2: number): Promise<AsyncInventory>
  async swapHotbar (slot1: number, slot2: number): Promise<AsyncInventory>
  async click      (slot:  number,   mousebutton: Bit): Promise<AsyncInventory>
  async dragClick  (slots: number[], mousebutton: Bit): Promise<AsyncInventory>
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
