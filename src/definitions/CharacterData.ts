import { Order } from "./Order"
import { Ident, Position, SpriteParams } from "./BaseTypes"

type CharacterData  = Ident & SpriteParams & Position & {
    type: 'character'
    isPlayer?: boolean
    orders: Order[]
    speed?: number
    dialogueColor?: string
}

export type { CharacterData }
