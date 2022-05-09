import { RoomData } from '../src/definitions/RoomData';
import testRoomImport from './OUTSIDE.json';
import {INSIDE} from './INSIDE';
import testRoomImport3 from './test-room-3.json';

const testRoom = testRoomImport as RoomData;
const testRoom3 = testRoomImport3 as RoomData;

export const initialRooms: RoomData[] = [testRoom, INSIDE, testRoom3];
