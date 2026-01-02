import { CELL_SIZE, XY } from "@/lib/types-and-constants";
import { GameData, MoveOrder, findPath } from "point-click-lib";
import { issueOrdersOutsideSequence } from "./issueOrders";
import { DebugLogger } from "../../game-state-logic/report-emitting";

export const issueMoveOrder = (
    destination: XY,
    actorId: string,
    appendToExisting?: boolean,
    ignoreObstacles?: boolean,
) => (state: GameData, debugLogger?: DebugLogger): Partial<GameData> => {

    const { cellMatrix, actors } = state
    const actor = actors.find(_ => _.id === actorId)
    if (!actor || !cellMatrix) { return {} }

    const steps = ignoreObstacles ? [destination] : findPath({ x: actor.x, y: actor.y }, destination, cellMatrix, CELL_SIZE)
    const newOrder: MoveOrder = { type: 'move', steps, pathIsSet: true }
    debugLogger?.(`move: [${actor.x}, ${actor.y}] -> [${destination.x},${destination.y}], steps:${steps.length}`, 'order')
    issueOrdersOutsideSequence(state, actor.id, [newOrder], !appendToExisting)
    return { actors }
}
