import { Order } from "./Order"

interface CharacterData {
    x: number
    y: number
    height: number
    width: number
    sprite: string
    orders: Order[]
    speed?: number
}

export type { CharacterData }
