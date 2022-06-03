import { h, FunctionalComponent } from 'preact';
import style from './style.css';

import GamePlayer from '../../components/GamePlayer';

const Home: FunctionalComponent = () => (
	<div className={style.home}>
		<GamePlayer />
	</div>
);

export default Home;
