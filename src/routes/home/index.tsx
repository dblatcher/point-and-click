import { h } from 'preact';
import style from './style.css';
import Game from '../../components/Game';

import { initialCharacters } from "../../../data/characters";
import { initialThings } from "../../../data/things";
import { initialRooms } from '../../../data/rooms';
import { items } from '../../../data/items';
import { verbs } from '../../../data/verbs';
import { interactions } from '../../../data/interactions';
import { sequences } from '../../../data/sequences';

const Home = () => (
	<div className={style.home}>

		<Game
			initialRooms={initialRooms}
			initialCharacters={initialCharacters}
			initialThings={initialThings}
			verbs={verbs}
			interactions={interactions}
			items={items}
			sequences={sequences}
		/>

	</div>
);

export default Home;
