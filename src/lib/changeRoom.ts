import { cellSize, GameState } from "../components/game";
import { generateCellMatrix } from "./pathfinding/cells";
import { Point } from "./pathfinding/geometry";


export function changeRoom(
    roomId: string,
    takePlayer?: boolean,
    newPosition?: Point
): { (state: GameState): Partial<GameState> } {

    return (state: GameState): Partial<GameState> => {

        const { rooms, actors } = state
        const room = rooms.find(room => room.id === roomId)
        if (!room) { return {} }

        const player = actors.find(_ => _.isPlayer)
        const cellMatrix = generateCellMatrix(room, cellSize)

        if (takePlayer && player) {
            player.room = room.id
            if (newPosition) {
                player.x = newPosition.x
                player.y = newPosition.y
            }
        }

        return {
            currentRoomId: room.id, cellMatrix, actors
        }
    }
}
