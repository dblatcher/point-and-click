import { cellSize, GameState } from ".";
import { MoveOrder } from "../../definitions/Order";
import { Point } from "../../lib/pathfinding/geometry";
import { findPath } from "../../lib/pathfinding/pathfind";

export function issueMoveOrder(
    pointClicked: Point,
    characterId: string,
    appendToExisting?: boolean
): { (state: GameState): Partial<GameState> } {

    return (state: GameState): Partial<GameState> => {

        const { cellMatrix, characters } = state
        const character = characters.find(_ => _.id === characterId)
        if (!character || !cellMatrix) { return {} }

        const steps = findPath({ x: character.x, y: character.y }, pointClicked, cellMatrix, cellSize)

        const newOrder: MoveOrder = { type: 'move', steps }

        if (appendToExisting) {
            state.characterOrders[character.id].push(newOrder)
        } else {
            state.characterOrders[character.id] = [newOrder] // clears any existing orders, even if the point was unreachable
        }

        return { characters }
    }
}