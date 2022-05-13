import { initialCharacters } from "./characters";
import { initialThings } from "./things";
import { initialRooms } from './rooms';
import { items } from './items';
import { verbs } from './verbs';
import { interactions } from './interactions';
import { sequences } from './sequences';
import { GameData, FixedGameInfo } from "../src/definitions/Game";


const player = initialCharacters.find(character => character.isPlayer)
const startingRoom = initialRooms.find(room => room.name === player?.room)

export const startingGameCondition: GameData & FixedGameInfo = {
    rooms: initialRooms,
    things: initialThings,
    characters: initialCharacters,
    interactions,
    items,
    verbs,
    sequences,
    characterOrders: {},
    thingOrders: {},
    sequenceRunning: undefined,
    currentRoomName: startingRoom.name,
}
