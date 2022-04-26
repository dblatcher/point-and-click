
import { Direction } from "./Sprite"

interface BaseData {
    type: string
    name?: string
    id: string
    room?: string
    x: number
    y: number
    height: number
    width: number
    sprite: string
    direction?: Direction
    filter?: string

}

interface ThingData extends BaseData {
    type: 'thing'
    status?: string
}

export type { ThingData, BaseData }
