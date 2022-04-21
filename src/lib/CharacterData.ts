import { Order } from "./Order"
import { Direction } from "./Sprite"

interface CharacterData {
    x: number
    y: number
    height: number
    width: number
    sprite: string
    orders: Order[]
    speed?: number
    direction?: Direction
}

export type { CharacterData }
