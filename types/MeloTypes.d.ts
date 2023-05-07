
type _ = { [n: symbol]: never }

type Dict<K extends keyof any = string, V = number> = { [P in K]?: V }

type EventCallback<E extends keyof Events, R = void> = (event: Events[E], context: Context) => R

type Context = EventContainer
type ClientPlayer = ClientPlayerEntityHelper
type Pos2D = PositionCommon$Pos2D
type Pos3D = PositionCommon$Pos3D
type Vec2D = PositionCommon$Vec2D
type Vec3D = PositionCommon$Vec3D
type BlockPos = BlockPosHelper

type Vec3DLike = Vec3D | number[] | number[][]
type Pos3DLike = Pos3D | number[] | Record<'x' | 'y' | 'z', number> |
  Record<'getX' | 'getY' | 'getZ', () => number>

/** you can also treat {@link AsyncInventory} and {@link Inventory} as InfoInventory */
type InfoInventory = Omit<Inventory, keyof PromisfiedInvMethods |
  'close' | 'closeAndDrop' | 'openGui' | 'quickAll'>

type AsyncInventory = Omit<Inventory, keyof PromisfiedInvMethods> & PromisfiedInvMethods

interface PromisfiedInvMethods {
  /** get the raw Inventory (the one without async) */
  readonly raw:  Inventory
  /** @alias raw */
  readonly sync: Inventory
  quick      (slot:  number): Promise<AsyncInventory>
  grabAll    (slot:  number): Promise<AsyncInventory>
  dropSlot   (slot:  number): Promise<AsyncInventory>
  swap       (slot1: number, slot2: number): Promise<AsyncInventory>
  split      (slot1: number, slot2: number): Promise<AsyncInventory>
  swapHotbar (slot1: number, slot2: HotbarSlot | OffhandSlot): Promise<AsyncInventory>
  click      (slot:  number,   mousebutton?: Bit): Promise<AsyncInventory>
  dragClick  (slots: number[], mousebutton:  Bit): Promise<AsyncInventory>
  /** @alias util.container.waitInterval */
  waitInterval<R>(cb?: () => R): Promise<R | undefined>
}

declare namespace Crafting {

  enum RecipeType {
    Book = 'recipe_book',
    Macro = 'macro'
  }

  namespace json {

    type Recipe = BookRecipe | MacroRecipe

    interface BaseRecipe {
      info: {
        input: Dict<ItemId>
        output: ItemId
        count: number
      }
      weight?: Dict<ItemId>
    }

    interface BookRecipe extends BaseRecipe {
      readonly type: 'recipe_book'
      id: RecipeId
    }

    interface MacroRecipe extends BaseRecipe {
      readonly type: 'macro'
      pattern: Pattern<ItemId>
    }

  }

  type Pattern<T> = [T, T, T, T, T, T, T, T, T]

}
