import { getBlankRoom, defaultVerbs1 } from "@/components/GameEditor/defaults";
import { gameDesign } from "@/data/test-game";
import { GameDesign } from "@/definitions";
import { DB_VERSION } from "../indexed-db";

const defaultRoomId = 'ROOM_1' as const;

export const getInitalDesign = (usePrebuiltGame?: boolean): GameDesign => {
    return usePrebuiltGame ? { ...gameDesign } : {
        id: "NEW_GAME",
        schemaVersion: DB_VERSION,
        rooms: [Object.assign(getBlankRoom(), { id: defaultRoomId, height: 150 })],
        actors: [],
        interactions: [],
        items: [],
        conversations: [],
        verbs: defaultVerbs1(),
        currentRoomId: defaultRoomId,
        sequences: [],
        sprites: [],
        storyBoards: [],
        flagMap: {},
    }

}
