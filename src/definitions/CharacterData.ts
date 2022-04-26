import { Order } from "./Order"
import { BaseData } from "./ThingData"


interface CharacterData extends BaseData{
    type: 'character'
    isPlayer?: boolean
    orders: Order[]
    speed?: number
    dialogueColor?: string
}

export type { CharacterData }
