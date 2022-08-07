import { h, FunctionalComponent } from "preact";
import style from "./style.css";

import GamePlayer from "../../components/GamePlayer";

const Game: FunctionalComponent = () => (
  <div className={style.home}>
    <GamePlayer usePrebuiltGame={false} />
  </div>
);

export default Game;
