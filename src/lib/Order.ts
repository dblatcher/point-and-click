import { Point } from "./pathfinding/geometry"

interface MoveOrder {
    type: 'move',
    path: Point[]
}

type Order = MoveOrder

export type { Order, MoveOrder }