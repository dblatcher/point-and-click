import { Point } from "../lib/pathfinding/geometry"

interface MoveOrder {
    type: 'move',
    steps: (Point & { animation?: string })[]
}

interface DialogueLine {
    text: string
    time: number
    animation?: string
}

interface TalkOrder {
    type: 'talk',
    steps: DialogueLine[]
}

type Order = MoveOrder | TalkOrder

export type { Order, MoveOrder, TalkOrder }