import { cellSize, GameState } from ".";
import { MoveOrder } from "@/oldsrc";
import { Point } from "@/lib/pathfinding/geometry";
import { findPath } from "@/lib/pathfinding/pathfind";
import { makeDebugEntry } from "../DebugLog";

export function issueMoveOrder(
    destination: Point,
    actorId: string,
    appendToExisting?: boolean,
    ignoreObstacles?: boolean
): { (state: GameState): Partial<GameState> } {

    return (state: GameState): Partial<GameState> => {

        const { cellMatrix, actors, debugLog } = state
        const actor = actors.find(_ => _.id === actorId)
        if (!actor || !cellMatrix) { return {} }

        const steps = ignoreObstacles ? [destination] : findPath({ x: actor.x, y: actor.y }, destination, cellMatrix, cellSize)
        const newOrder: MoveOrder = { type: 'move', steps, pathIsSet: true }
        debugLog.push(makeDebugEntry(`move: [${actor.x}, ${actor.y}] -> [${destination.x},${destination.y}], steps:${steps.length}`, 'order'))

        if (!state.actorOrders[actor.id]) {
            state.actorOrders[actor.id] = []
        }
        if (appendToExisting) {
            state.actorOrders[actor.id].push(newOrder)
        } else {
            state.actorOrders[actor.id] = [newOrder] // clears any existing orders, even if the point was unreachable
        }

        return { actors, debugLog }
    }
}