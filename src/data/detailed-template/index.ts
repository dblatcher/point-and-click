import { SoundAsset } from "@/services/assets";
import { GameDesign } from "point-click-lib";
import { imageAssets as allImageAssets } from "../images";
import { beach, npc, player } from "../shared";
import { boySprite } from "../sprites/boySprite";
import { detailedVerbSet } from '../verbs';
import type { DesignAndAssets } from "@/lib/api-usage";

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
    'tube.png',
].includes(asset.id))

export { imageAssets };

export const detailedTemplate: DesignAndAssets = {
    gameDesign,
    imageAssets,
    soundAssets,
}

const designForConversationTutorial: GameDesign = {
    ...gameDesign,
    interactions: [
        {
            targetId: 'NPC',
            verbId: 'TALK',
            consequences: [
                {
                    type: 'order',
                    actorId: 'PLAYER',
                    orders: [
                        { type: 'say', 'text': 'hello', time: 150}
                    ]
                }
            ]
        }
    ]
}

export const conversationTutorial: DesignAndAssets = {
    gameDesign: designForConversationTutorial,
    imageAssets,
    soundAssets,
}
