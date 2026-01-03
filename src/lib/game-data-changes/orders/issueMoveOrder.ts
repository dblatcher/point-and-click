import { CELL_SIZE, XY } from "@/lib/types-and-constants";
import { GameData, MoveOrder, findPath } from "point-click-lib";
import { issueOrdersOutsideSequence } from "./issueOrders";
import { DebugLogger } from "@/lib/inGameDebugging";

export const issueMoveOrder = (
    debugLogger?: DebugLogger,
) => (
    state: GameData,
    destination: XY,
    actorId: string,
    appendToExisting = false,
    ignoreObstacles = false,
): Partial<GameData> => {
        const { cellMatrix, actors } = state
        const actor = actors.find(_ => _.id === actorId)
        if (!actor || !cellMatrix) { return {} }
        const steps = ignoreObstacles ? [destination] : findPath({ x: actor.x, y: actor.y }, destination, cellMatrix, CELL_SIZE)
        const newOrder: MoveOrder = { type: 'move', steps, pathIsSet: true }
        debugLogger?.(`move: [${actor.x}, ${actor.y}] -> [${destination.x},${destination.y}], steps:${steps.length}`, 'order')
        issueOrdersOutsideSequence(state, actor.id, [newOrder], !appendToExisting)
        return { actors }
    }
