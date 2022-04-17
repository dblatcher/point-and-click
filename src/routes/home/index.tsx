import { h } from 'preact';
import style from './style.css';
import type { RoomData } from '../../lib/RoomData';

import testRoomImport from '../../../data/test-room.json';
import testRoomImport2 from '../../../data/test-room-2.json';
import testRoomImport3 from '../../../data/test-room-3.json';
import { TestGame } from '../../components/TestGame';
import Game from '../../components/Game';

const  testRoom = testRoomImport as RoomData;
const  testRoom2 = testRoomImport2 as RoomData;
const  testRoom3 = testRoomImport3 as RoomData;

console.log(testRoom);

const Home = () => (
	<div className={style.home}>
		<h1>Home</h1>
		
		<Game data={testRoom} />

		<TestGame data={testRoom} />
		<TestGame data={testRoom2} />
		<TestGame data={testRoom3} />
	</div>
);

export default Home;
