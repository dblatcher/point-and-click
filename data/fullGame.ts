import { initialCharacters as characters } from "./characters";
import { initialRooms as rooms } from './rooms';
import { items } from './items';
import { verbs } from './verbs';
import { interactions } from './interactions';
import { sequences } from './sequences';
import { conversations } from './conversations';
import { spriteInputs } from './sprites'
import { endings } from './endings'
import { GameCondition } from "../src/definitions/Game";

const player = characters.find(character => character.isPlayer)
const startingRoom = rooms.find(room => room.id === player?.room) || rooms[0]

export const startingGameCondition: GameCondition = {
    id:"THE_TEST_GAME",
    rooms,
    characters,
    interactions,
    items,
    verbs,
    sequences,
    characterOrders: {},
    sequenceRunning: undefined,
    currentRoomId: startingRoom.id,
    conversations,
    endings,
    sprites: spriteInputs.map(input=>input.data),
    spriteSheets: spriteInputs.flatMap(input => input.sheets),
}
