import { initialActors as actors } from "./actors";
import { initialRooms as rooms } from './rooms';
import { items } from './items';
import { verbs } from './verbs';
import { interactions } from './interactions';
import { sequences } from './sequences';
import { conversations } from './conversations';
import { spriteDataList } from './sprites'
import { flagMap } from './flags'
import { storyBoards } from './storyBoards'
import { GameDesign } from "../definitions/Game";

export { imageAssets } from "./images"
export { soundAssets } from "./sounds"

export const prebuiltGameDesign: GameDesign = {
    id: "THE_TEST_GAME",
    schemaVersion: 4,
    rooms,
    actors,
    interactions,
    items,
    verbs,
    sequences,
    currentRoomId: 'OUTSIDE',
    conversations,
    sprites: spriteDataList,
    flagMap,
    openingSequenceId: 'intro',
    openingStoryboardId: 'test-board',
    storyBoards: storyBoards
}
