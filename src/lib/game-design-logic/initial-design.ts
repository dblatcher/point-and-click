import { getBlankRoom, defaultVerbs1 } from "@/components/GameEditor/defaults";
import { prebuiltGameDesign } from "@/data/fullGame";
import { GameDesign } from "@/definitions";

const defaultRoomId = 'ROOM_1' as const;

export const getInitalDesign = (usePrebuiltGame?: boolean): GameDesign => {
    return usePrebuiltGame ? { ...prebuiltGameDesign } : {
        id: "NEW_GAME",
        rooms: [Object.assign(getBlankRoom(), { id: defaultRoomId, height: 150 })],
        actors: [],
        interactions: [],
        items: [],
        conversations: [],
        verbs: defaultVerbs1(),
        currentRoomId: defaultRoomId,
        sequences: [],
        sprites: [],
        endings: [],
        flagMap: {},
    }

}