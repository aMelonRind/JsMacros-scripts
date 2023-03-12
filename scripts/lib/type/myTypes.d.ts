
import {} from './fetchRawJsType.js'

type Dict = { [id: string]: number }
type context = EventContainer<any>
type ClientPlayer = ClientPlayerEntityHelper<any>

type Vec3DLike = Vec3D | number[] | number[][]
type Pos3DLike = Pos3D | number[] | { x: number, y:number, z:number } |
  { getX: () => number, getY: () => number, getZ: () => number }

type Recipe = {
  on: string
  type: string
  id: string
  info: {
    input: { [id: string]: number }
    output: string
    count: number
  }
  weight: { [id: string]: number }
}
