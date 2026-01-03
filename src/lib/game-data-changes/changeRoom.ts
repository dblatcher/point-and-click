import { GameRuntimeOptions, XY } from "@/lib/types-and-constants";
import { GameData, GameDesign, generateCellMatrix } from "point-click-lib";

export const changeRoom = (
    props: GameDesign & GameRuntimeOptions,
) => (
    state: GameData, roomId: string,
    takePlayer?: boolean,
    newPosition?: XY
): Partial<GameData | undefined> => {

        const { rooms, actors } = state
        const room = rooms.find(room => room.id === roomId)
        if (!room) { return undefined }

        const player = actors.find(_ => _.isPlayer)
        const cellMatrix = generateCellMatrix(room, props.cellSize)

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

