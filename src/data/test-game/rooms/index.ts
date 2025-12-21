import type { RoomData } from 'point-click-lib';
import { INSIDE } from './INSIDE';
import testRoomImport from './OUTSIDE.room.json';
import { SQUARE_ROOM } from './square-room';
import testRoomImport3 from './test-room-3.json';

const testRoom = testRoomImport as RoomData;
const testRoom3 = testRoomImport3 as RoomData;

export const initialRooms: RoomData[] = [testRoom, INSIDE, testRoom3, SQUARE_ROOM];
