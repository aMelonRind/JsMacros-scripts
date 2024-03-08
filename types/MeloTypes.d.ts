
type _ = { [n: symbol]: never }

type Dict<K extends keyof any = string, V = number> = { [P in K]?: V }

type EventCallback<E extends keyof Events, R = void> = (event: Events[E], context: EventContainer) => R
type Callback<R = any> = (...args: any[]) => R
type Filter<T> = (v: any) => v is T
type Condition<A extends [...any] = []> = (...args: A) => any

type DummyType<C extends string> = JavaObject & Record<` $ts_className_${C}`, C> & { [key: string]: any }

type ArrayList<T = any> = Packages.java.util.ArrayList<T>
type HashMap<K = any, V = any> = Packages.java.util.HashMap<K, V>
type Field = Packages.java.lang.reflect.Field
type ClientPlayer = ClientPlayerEntityHelper
type BlockPos = BlockPosHelper // minecraft types isn't installed anyways

// minecraft dummy types
type NbtElement = DummyType<'NbtElement'>
type NbtCompound = NbtElement & DummyType<'NbtCompound'>
type NbtList = NbtElement & DummyType<'NbtList'>

type Axis = 'x' | 'y' | 'z'
type Pos3DTuple = [number, number, number]

type Pos3DLike =
| Pos3D
| number[]
| Pos3DTuple
| Record<Axis, number>
| Record<`get${Uppercase<Axis>}`, () => number>

type ItemRecord<T = number> = Partial<Record<ItemId, T>>

interface InfoInventory extends Inventory {
  /** @deprecated */ quick(n: never): never
  /** @deprecated */ grabAll(n: never): never
  /** @deprecated */ dropSlot(n: never): never
  /** @deprecated */ swap(n: never): never
  /** @deprecated */ split(n: never): never
  /** @deprecated */ swapHotbar(n: never): never
  /** @deprecated */ click(n: never): never
  /** @deprecated */ dragClick(n: never): never
  /** @deprecated */ close(n: never): never
  /** @deprecated */ closeAndDrop(n: never): never
  /** @deprecated */ openGui(n: never): never
  /** @deprecated */ quickAll(n: never): never
}
