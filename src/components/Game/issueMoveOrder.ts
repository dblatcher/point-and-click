import { cellSize, GameState } from ".";
import { MoveOrder } from "src";
import { Point } from "../../lib/pathfinding/geometry";
import { findPath } from "../../lib/pathfinding/pathfind";

export function issueMoveOrder(
    destination: Point,
    characterId: string,
    appendToExisting?: boolean,
    ignoreObstacles?: boolean
): { (state: GameState): Partial<GameState> } {

    return (state: GameState): Partial<GameState> => {

        const { cellMatrix, characters } = state
        const character = characters.find(_ => _.id === characterId)
        if (!character || !cellMatrix) { return {} }

        const steps = ignoreObstacles ? [destination] : findPath({ x: character.x, y: character.y }, destination, cellMatrix, cellSize)
        const newOrder: MoveOrder = { type: 'move', steps, pathIsSet: true }

        if (!state.characterOrders[character.id]) {
            state.characterOrders[character.id] = []
        }
        if (appendToExisting) {
            state.characterOrders[character.id].push(newOrder)
        } else {
            state.characterOrders[character.id] = [newOrder] // clears any existing orders, even if the point was unreachable
        }

        return { characters }
    }
}