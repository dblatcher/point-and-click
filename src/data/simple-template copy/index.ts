import { SoundAsset } from "@/services/assets";
import { GameDesign } from "../../definitions/Game";
import { allSprites } from '../sprites';
import { minimalVerbSet } from '../verbs';
import { imageAssets as allImageAssets } from "../images";

export const gameDesign: GameDesign = {
    id: "SIMPLE",
    schemaVersion: 4,
    rooms: [
        { "id": "room-1", "frameWidth": 320, "width": 400, "height": 200, "background": [{ "parallax": 0, "imageId": "sky.png" }, { "parallax": 1, "imageId": "beach-s.png" }], "backgroundColor": "#AEF4F9", "obstacleAreas": [], "hotspots": [], "walkableAreas": [{ "x": 0, "y": 53, "rect": [400, 53] }] },
    ],
    actors: [
        {
            id: 'PLAYER',
            width: 50,
            height: 50,
            type: "actor",
            x: 50,
            y: 10,
            isPlayer: true,
            sprite: 'boy',
            room: 'room-1',
            dialogueColor: '#F00A0A'
        },
        {
            id: 'NPC',
            width: 50,
            height: 50,
            type: "actor",
            x: 150,
            y: 20,
            sprite: 'boy',
            room: 'room-1',
            filter: 'hue-rotate(60deg)',
            dialogueColor: '#0AF00A'
        },
    ],
    interactions: [],
    items: [],
    verbs: minimalVerbSet,
    sequences: [],
    currentRoomId: 'room-1',
    conversations: [],
    sprites: allSprites,
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

export { imageAssets }