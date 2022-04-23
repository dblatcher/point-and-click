import { Order } from "./Order"
import { Direction } from "./Sprite"

interface CharacterData {
    id: string
    isPlayer?: boolean
    room?: string
    x: number
    y: number
    height: number
    width: number
    sprite: string
    orders: Order[]
    speed?: number
    direction?: Direction
    filter?: string
    dialogueColor?: string
}

export type { CharacterData }
