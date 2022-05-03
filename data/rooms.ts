import testRoomImport from './OUTSIDE.json';
import testRoomImport2 from './INSIDE.json';
import testRoomImport3 from './test-room-3.json';
import { RoomData } from '../src/definitions/RoomData';

const testRoom = testRoomImport as RoomData;
const testRoom2 = testRoomImport2 as RoomData;
const testRoom3 = testRoomImport3 as RoomData;

export const initialRooms: RoomData[] = [testRoom, testRoom2, testRoom3];
