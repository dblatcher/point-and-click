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
                            type: 'text',
                            x: 'left',
                            y: 'bottom',
                            width: 50,
                            height: 50,
                            text: ['A dark and story night', 'in mid October...'],
                        },
                        {
                            type: 'text',
                            x: 'center',
                            y: 'center',
                            text: ['hello'],
                        },
                        {
                            type: 'image',
                            x: 'center',
                            y: 'top',
                            image: { imageId: 'bucket.png'},
                            width:30,
                            height:30,
                        },
                        {
                            type: 'image',
                            x: 'right',
                            y: 'top',
                            image: { imageId: 'mario.png'},
                            width:20,
                            height:80,
                        },
                        {
                            type: 'image',
                            x: 'center',
                            y: 'bottom',
                            image: { imageId: 'no such.png'},
                        },
                    ]
                },
                {
                    title: "this is the second and last page",
                    parts: []
                },
            ]
        }, {
            id: 'part-two',
            pages: [
                {
                    title: 'Welcome to part two',
                    parts: []
                }
            ]
        }
    ]
}
