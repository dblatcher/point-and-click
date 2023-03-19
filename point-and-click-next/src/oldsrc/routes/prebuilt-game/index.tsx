import { h, FunctionComponent } from "preact";
import style from "./style.css";

import GamePlayer from "../../components/GamePlayer";
import { prebuiltGameDesign } from "../../../data/fullGame";
import { imageAssets } from "../../../data/images";
import { soundAssets } from "../../../data/sounds";

const PrebuiltGame: FunctionComponent = () => (
  <div className={style.home}>
    <GamePlayer prebuiltGame={prebuiltGameDesign} prebuiltImageAssets={imageAssets} prebuiltSoundAssets={soundAssets} />
  </div>
);

export default PrebuiltGame;
