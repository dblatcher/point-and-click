import testRoomImport from './test-room.json';
import testRoomImport2 from './test-room-2.json';
import testRoomImport3 from './test-room-3.json';
import { RoomData } from '../src/lib/RoomData';

const testRoom = testRoomImport as RoomData;
const testRoom2 = testRoomImport2 as RoomData;
const testRoom3 = testRoomImport3 as RoomData;

export const initialRooms: RoomData[] = [testRoom, testRoom2, testRoom3];
