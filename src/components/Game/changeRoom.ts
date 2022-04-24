import { GameState } from ".";
import { generateCellMatrix } from "../../lib/pathfinding/cells";
import { Point } from "../../lib/pathfinding/geometry";
import { RoomData } from "../../lib/RoomData";


export function changeRoom(
    room: RoomData,
    cellSize: number,
    takePlayer?: boolean,
    newPosition?: Point
): { (state: GameState): Partial<GameState> } {

    return (state: GameState) => {
        const { characters } = state
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
            currentRoomName:room.name, cellMatrix, characters
        }
    }
}
