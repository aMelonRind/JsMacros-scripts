
// import {} from './fetchRawJsType.js' // will break other types

type Dict = { [id: string]: number }
type Context = EventContainer<any>
type EventCallback<E, R = void> = (event: JsmEvents[E], context: Context) => R
type ClientPlayer = ClientPlayerEntityHelper<any>

type Vec3DLike = Vec3D | number[] | number[][]
type Pos3DLike = Pos3D | number[] | { x: number, y: number, z: number } |
  { getX: () => number, getY: () => number, getZ: () => number }

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

type AsyncInventory = Inventory<any> & {
  async waitInterval(): Promise<void>
  async click(): Promise<void>
}
