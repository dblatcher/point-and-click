import { Point } from "../lib/pathfinding/geometry"
import { Order } from "./Order"

interface OrderConsequence {
    type: 'order',
    characterId?: string
    orders: Order[]
    replaceCurrentOrders?: boolean
}

interface TalkConsequence {
    type: 'talk',
    characterId?: string
    text: string,
    time?: number,
}

interface ChangeRoomConsequence {
    type: 'changeRoom'
    roomId: string,
    takePlayer: boolean,
    point?: Point
}

interface InventoryConsequence {
    type: 'inventory',
    itemId: string,
    characterId?: string,
    addOrRemove: 'ADD' | 'REMOVE',
}

type Consequence = OrderConsequence | ChangeRoomConsequence | TalkConsequence | InventoryConsequence

interface Interaction {
    verbId: string
    targetId: string
    targetType?: string // to do -implement
    roomId?: string
    itemId?: string
    consequences: Consequence[]
}

export type { Interaction, Consequence, OrderConsequence, ChangeRoomConsequence, InventoryConsequence }