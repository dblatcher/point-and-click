import { Point } from "../lib/pathfinding/geometry"

interface MoveOrder {
    type: 'move',
    steps: (Point & { animation?: string, speed?: number })[]
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

interface ActionStep {
    animation?: string
    duration: number
    timeElapsed?: number
}

interface ActOrder {
    type: 'act',
    steps: ActionStep[]
}

type Order = MoveOrder | TalkOrder | ActOrder
type ThingOrder = ActOrder

export type { Order, ThingOrder, MoveOrder, TalkOrder, ActOrder }