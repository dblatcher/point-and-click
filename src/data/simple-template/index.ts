import { SoundAsset } from "@/services/assets";
import { GameDesign } from "../../definitions/Game";
import { imageAssets as allImageAssets } from "../images";
import { beach, npc, player } from "../shared";
import { boySprite } from "../sprites/boySprite";
import { minimalVerbSet } from '../verbs';

export const gameDesign: GameDesign = {
    id: "SIMPLE",
    schemaVersion: 4,
    rooms: [
        beach,
    ],
    actors: [
        player,
        npc
    ],
    interactions: [],
    items: [],
    verbs: minimalVerbSet,
    sequences: [],
    currentRoomId: 'room-1',
    conversations: [],
    sprites: [boySprite],
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
