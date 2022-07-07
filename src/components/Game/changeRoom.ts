import { cellSize, GameState } from ".";
import { generateCellMatrix } from "../../lib/pathfinding/cells";
import { Point } from "../../lib/pathfinding/geometry";


export function changeRoom(
    roomId: string,
    takePlayer?: boolean,
    newPosition?: Point
): { (state: GameState): Partial<GameState> } {

    return (state: GameState) => {

        const { rooms, characters } = state
        const room = rooms.find(room => room.id === roomId)
        if (!room) { return {} }

        const player = characters.find(_ => _.isPlayer)
        const cellMatrix = generateCellMatrix(room, cellSize)

        if (takePlayer && player) {
            player.room = room.id
            if (newPosition) {
                player.x = newPosition.x
                player.y = newPosition.y
            }
        }

        return {
            currentRoomId: room.id, cellMatrix, characters
        }
    }
}
