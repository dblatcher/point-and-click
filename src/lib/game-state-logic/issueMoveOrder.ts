import { GameState } from "@/lib/game-state-logic/types";
import { cellSize } from "../../components/game";
import { MoveOrder } from "@/definitions";
import { Point } from "@/lib/pathfinding/geometry";
import { findPath } from "@/lib/pathfinding/pathfind";
import { makeDebugEntry } from "@/lib/inGameDebugging";
import { issueOrdersOutsideSequence } from "./orders/issueOrders";

export function issueMoveOrder(
    destination: Point,
    actorId: string,
    appendToExisting?: boolean,
    ignoreObstacles?: boolean,
): { (state: GameState): Partial<GameState> } {

    return (state: GameState): Partial<GameState> => {

        const { cellMatrix, actors } = state
        const actor = actors.find(_ => _.id === actorId)
        if (!actor || !cellMatrix) { return {} }

        const steps = ignoreObstacles ? [destination] : findPath({ x: actor.x, y: actor.y }, destination, cellMatrix, cellSize)
        const newOrder: MoveOrder = { type: 'move', steps, pathIsSet: true }
        state.emitter.emit('debugLog', makeDebugEntry(`move: [${actor.x}, ${actor.y}] -> [${destination.x},${destination.y}], steps:${steps.length}`, 'order'))
        issueOrdersOutsideSequence(state, actor.id, [newOrder], !appendToExisting)
        return { actors }
    }
}