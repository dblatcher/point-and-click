import { Order } from "./Order"
import { Direction } from "./Sprite"

interface CharacterData {
    isPlayer?: boolean
    x: number
    y: number
    height: number
    width: number
    sprite: string
    orders: Order[]
    speed?: number
    direction?: Direction
    filter?: string
}

export type { CharacterData }
