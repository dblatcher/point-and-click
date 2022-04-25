import { h } from 'preact';
import style from './style.css';
import Game from '../../components/Game';

import { initialCharacters } from "../../../data/characters";
import { initialThings } from "../../../data/things";
import { initialRooms } from '../../../data/rooms';
import { verbs } from '../../../data/verbs';

const Home = () => (
	<div className={style.home}>
		<h1>Home</h1>

		<Game
			initialRooms={initialRooms}
			initialCharacters={initialCharacters}
			initialThings={initialThings}
			verbs={verbs}
		/>

	</div>
);

export default Home;
