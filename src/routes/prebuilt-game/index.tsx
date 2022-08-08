import { h, FunctionalComponent } from "preact";
import style from "./style.css";

import GamePlayer from "../../components/GamePlayer";
import { prebuiltGameDesign } from "../../../data/fullGame";
import { assets } from "../../../data/images";

const PrebuiltGame: FunctionalComponent = () => (
  <div className={style.home}>
    <GamePlayer prebuiltGame={prebuiltGameDesign} prebuiltAssets={assets} />
  </div>
);

export default PrebuiltGame;
