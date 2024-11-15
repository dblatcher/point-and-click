import { initialActors as actors } from "./actors";
import { initialRooms as rooms } from './rooms';
import { items } from './items';
import { verbs } from './verbs';
import { interactions } from './interactions';
import { sequences } from './sequences';
import { conversations } from './conversations';
import { spriteDataList } from './sprites'
import { endings } from './endings'
import { flagMap } from './flags'
import { GameDesign } from "../definitions/Game";

const player = actors.find(actor => actor.isPlayer)
const startingRoom = rooms.find(room => room.id === player?.room) || rooms[0]

export const prebuiltGameDesign: GameDesign = {
    id: "THE_TEST_GAME",
    rooms,
    actors,
    interactions,
    items,
    verbs,
    sequences,
    currentRoomId: startingRoom.id,
    conversations,
    endings,
    sprites: spriteDataList,
    flagMap,
    openingSequenceId: 'intro',
    openingStoryboardId: 'test-board',
    storyBoards: [
        {
        id: 'test-board',
        pages: [
            {
                title: "this is the first page",
                parts: [
                    {
                        type:'text',
                        x:'left',
                        y:'bottom',
                        text:'A dark and story night',
                    },
                    {
                        type: 'text',
                        x: 'center',
                        y: 'center',
                        text: 'hello'
                    },
                    {
                        type: 'image',
                        x: 'center',
                        y: 'top',
                        imageAssetId: 'bucket.png'
                    },
                    {
                        type: 'image',
                        x: 'center',
                        y: 'bottom',
                        imageAssetId: 'hello'
                    },
                ]
            },
            {
                title: "this is the second and last page",
                parts: []
            },
        ]
    },{
        id:'part-two',
        pages:[
            {
                title: 'Welcome to part two',
                parts: []
            }
        ]
    }
]
}
