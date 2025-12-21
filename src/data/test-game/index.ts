import { GameDesign } from "point-click-lib";
import { allSprites } from '../sprites';
import { detailedVerbSet } from '../verbs';
import { initialActors as actors } from "./actors";
import { conversations } from './conversations';
import { flagMap } from './flags';
import { interactions } from './interactions';
import { items } from './items';
import { initialRooms as rooms } from './rooms';
import { sequences } from './sequences';
import { storyBoards } from './storyBoards';

export { imageAssets } from "../images";
export { soundAssets } from "../sounds";

export const gameDesign: GameDesign = {
    id: "THE_TEST_GAME",
    schemaVersion: 4,
    rooms,
    actors,
    interactions,
    items,
    verbs: detailedVerbSet,
    sequences,
    currentRoomId: 'OUTSIDE',
    conversations,
    sprites: allSprites,
    flagMap,
    openingSequenceId: 'intro',
    openingStoryboardId: 'test-board',
    storyBoards: storyBoards
}
