import { initialActors as actors } from "./actors";
import { initialRooms as rooms } from './rooms';
import { items } from './items';
import { verbs } from './verbs';
import { interactions } from './interactions';
import { sequences } from './sequences';
import { conversations } from './conversations';
import { spriteDataList } from './sprites'
import { flagMap } from './flags'
import { GameDesign } from "../definitions/Game";

const player = actors.find(actor => actor.isPlayer)
const startingRoom = rooms.find(room => room.id === player?.room) || rooms[0]

export const prebuiltGameDesign: GameDesign = {
    id: "THE_TEST_GAME",
    schemaVersion: 4,
    rooms,
    actors,
    interactions,
    items,
    verbs,
    sequences,
    currentRoomId: startingRoom.id,
    conversations,
    sprites: spriteDataList,
    flagMap,
    openingSequenceId: 'intro',
    openingStoryboardId: 'test-board',
    storyBoards: [
        {
            id: 'test-board',
            pages: [
                {
                    title: "Welcome to the test game",
                    narrative: {
                        text: [
                            'This is not a real game, but just an example to show how the various features work.',
                            'You can download it and open it in the editor instead of starting from a blank state.'
                        ]
                    },
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    pictures: [
                        {
                            x: 'center',
                            y: 'top',
                            image: { imageId: 'bucket.png' },
                            width: 6,
                            height: 6,
                        },
                        {
                            x: 'right',
                            y: 'top',
                            image: { imageId: 'mario.png' },
                            width: 6,
                            height: 14,
                            aspectRatio: { x: 2, y: 3 }
                        },
                    ]
                },
                {
                    title: "The content is not meant to make sense!",
                    narrative: {
                        text: ['let us begin']
                    },
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    pictures: []
                },
            ]
        }, {
            id: 'part-two',
            pages: [
                {
                    title: 'Welcome to part two',
                    narrative: {
                        text: ['let us begin']
                    },
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    pictures: []
                },
                {
                    title: 'Welcome to part two',
                    narrative: {
                        text: ['let us begin now']
                    },
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    pictures: []
                },
                {
                    title: 'Welcome to part two',
                    narrative: {
                        text: ['let us begin now now']
                    },
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    pictures: []
                },
                {
                    title: 'Welcome to part two',
                    narrative: {
                        text: ['let us begin now now now']
                    },
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    pictures: []
                },
            ]
        }, {
            id: 'WIN',
            isEndOfGame: true,
            pages: [
                {
                    title: 'game over',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    pictures: [],
                    narrative: {
                        text: [
                            'This is a storyboard used to show that the game is over.',
                            'Closing it will restart the game'
                        ]
                    }
                }
            ]
        }
    ]
}
