import { h, FunctionalComponent } from "preact";
import style from "./style.css";

import GamePlayer from "../../components/GamePlayer";

const Game: FunctionalComponent = () => (
  <div className={style.home}>
    <GamePlayer />
    <br />
    <a href="/assets/castle-life.game.zip" download={'castle-life.game.zip'} target="_blank">download castle game file</a>
    <br />
    <a href="/assets/THE_TEST_GAME.game.zip" download={'THE_TEST_GAME.game.zip'} target="_blank">download test game file</a>
  </div>
);

export default Game;
