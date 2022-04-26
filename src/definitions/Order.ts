import { Point } from "../lib/pathfinding/geometry"

interface MoveOrder {
    type: 'move',
    steps: Point[]
}

interface DialogueLine {
    text: string
    time: number
}

interface TalkOrder {
    type: 'talk',
    steps: DialogueLine[]
}

type Order = MoveOrder | TalkOrder

export type { Order, MoveOrder, TalkOrder }