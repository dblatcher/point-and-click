import { h, FunctionalComponent } from "preact";
import style from "./style.css";

import GamePlayer from "../../components/GamePlayer";

const PrebuiltGame: FunctionalComponent = () => (
  <div className={style.home}>
    <GamePlayer usePrebuiltGame={true} />
  </div>
);

export default PrebuiltGame;
