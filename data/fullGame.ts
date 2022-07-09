import { initialCharacters as characters } from "./characters";
import { initialThings as things } from "./things";
import { initialRooms as rooms } from './rooms';
import { items } from './items';
import { verbs } from './verbs';
import { interactions } from './interactions';
import { sequences } from './sequences';
import { conversations } from './conversations';
import { spriteInputs } from './sprites'
import { GameData, FixedGameInfo } from "../src/definitions/Game";

const player = characters.find(character => character.isPlayer)
const startingRoom = rooms.find(room => room.id === player?.room) || rooms[0]

export const startingGameCondition: GameData & FixedGameInfo = {
    rooms,
    things,
    characters,
    interactions,
    items,
    verbs,
    sequences,
    characterOrders: {},
    thingOrders: {},
    sequenceRunning: undefined,
    currentRoomId: startingRoom.id,
    conversations,
    sprites: spriteInputs.map(input=>input.data),
    spriteSheets: spriteInputs.flatMap(input => input.sheets),
}
