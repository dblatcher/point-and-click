import { cellSize, GameState } from ".";
import { generateCellMatrix } from "../../lib/pathfinding/cells";
import { Point } from "../../lib/pathfinding/geometry";


export function changeRoom(
    roomName: string,
    takePlayer?: boolean,
    newPosition?: Point
): { (state: GameState): Partial<GameState> } {

    return (state: GameState) => {

        const { rooms, characters } = state
        const room = rooms.find(room => room.name === roomName)
        if (!room) { return {} }

        const player = characters.find(_ => _.isPlayer)
        const cellMatrix = generateCellMatrix(room, cellSize)

        if (takePlayer && player) {
            player.room = room.name
            if (newPosition) {
                player.x = newPosition.x
                player.y = newPosition.y
            }
        }

        return {
            currentRoomName: room.name, cellMatrix, characters
        }
    }
}
