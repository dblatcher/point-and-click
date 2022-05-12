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
import { GameData, GameProps } from '../../definitions/Game';


const makeNewGame = (): GameProps => {
	const player = initialCharacters.find(character => character.isPlayer)
	const startingRoom = initialRooms.find(room => room.name === player?.room)

	return {
		rooms: initialRooms,
		characters: initialCharacters,
		things: initialThings,
		verbs: verbs,
		interactions: interactions,
		items: items,
		sequences: sequences,
		currentRoomName: startingRoom.name,
	}
}

const Home = () => (
	<div className={style.home}>

		<Game
			{...makeNewGame()}
			save={(data: GameData) => {
				console.log('save data is', data)
			}}
		/>

	</div>
);

export default Home;
