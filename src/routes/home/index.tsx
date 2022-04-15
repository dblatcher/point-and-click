import { h } from 'preact';
import style from './style.css';
import type { RoomData } from '../../lib/RoomData';

import testRoomImport from '../../../data/test-room.json';
import { TestGame } from '../../components/TestGame';

const  testRoom = testRoomImport as RoomData;

console.log(testRoom);

const Home = () => (
	<div class={style.home}>
		<h1>Home</h1>
		<p>This is the Home component.</p>
		<TestGame data={testRoom} />
	</div>
);

export default Home;
