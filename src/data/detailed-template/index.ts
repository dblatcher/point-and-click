import { SoundAsset } from "@/services/assets";
import { GameDesign } from "../../definitions/Game";
import { imageAssets as allImageAssets } from "../images";
import { spriteDataList } from '../sprites';
import { detailedVerbSet } from '../verbs';
import { beach, npc, player } from "../shared";

export const gameDesign: GameDesign = {
    id: "DETAILED",
    schemaVersion: 4,
    rooms: [
        beach
    ],
    actors: [
        player,
        npc
    ],
    interactions: [],
    items: [],
    verbs: detailedVerbSet,
    sequences: [],
    currentRoomId: 'room-1',
    conversations: [],
    sprites: spriteDataList,
    flagMap: {},
    openingSequenceId: undefined,
    openingStoryboardId: undefined,
    storyBoards: []
}
export const soundAssets: SoundAsset[] = []

const imageAssets = allImageAssets.filter(asset => [
    'boy.png',
    'sky.png',
    'beach-s.png',
].includes(asset.id))

export { imageAssets };
