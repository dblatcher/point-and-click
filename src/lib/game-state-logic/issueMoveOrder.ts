import { GameState } from "@/lib/game-state-logic/types";
import { CELL_SIZE, findPath } from "@/lib/pathfinding";
import { MoveOrder } from "point-click-lib";
import { XY } from "typed-geometry";
import { issueOrdersOutsideSequence } from "./orders/issueOrders";
import { DebugLogger } from "./report-emitting";

export const issueMoveOrder = (
    destination: XY,
    actorId: string,
    appendToExisting?: boolean,
    ignoreObstacles?: boolean,
) => (state: GameState, debugLogger?: DebugLogger): Partial<GameState> => {

    const { cellMatrix, actors } = state
    const actor = actors.find(_ => _.id === actorId)
    if (!actor || !cellMatrix) { return {} }

    const steps = ignoreObstacles ? [destination] : findPath({ x: actor.x, y: actor.y }, destination, cellMatrix, CELL_SIZE)
    const newOrder: MoveOrder = { type: 'move', steps, pathIsSet: true }
    debugLogger?.(`move: [${actor.x}, ${actor.y}] -> [${destination.x},${destination.y}], steps:${steps.length}`, 'order')
    issueOrdersOutsideSequence(state, actor.id, [newOrder], !appendToExisting)
    return { actors }
}
