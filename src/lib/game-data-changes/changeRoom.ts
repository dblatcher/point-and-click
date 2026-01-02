import { CELL_SIZE, XY } from "@/lib/types-and-constants";
import { GameData, generateCellMatrix } from "point-click-lib";

export const changeRoom = (
    roomId: string,
    takePlayer?: boolean,
    newPosition?: XY
) => (state: GameData): Partial<GameData | undefined> => {

    const { rooms, actors } = state
    const room = rooms.find(room => room.id === roomId)
    if (!room) { return undefined }

    const player = actors.find(_ => _.isPlayer)
    const cellMatrix = generateCellMatrix(room, CELL_SIZE)

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

