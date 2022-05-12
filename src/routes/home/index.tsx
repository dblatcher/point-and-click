import { h } from 'preact';
import style from './style.css';

import GamePlayer from '../../components/GamePlayer';

const Home = () => (
	<div className={style.home}>
		<GamePlayer />
	</div>
);

export default Home;
