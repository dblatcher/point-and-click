/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h, Fragment } from "preact";
import { GameCondition, GameData, GameDesign } from "src";
import { prebuiltGameDesign } from "../../../data/fullGame";
import Game from "../Game";
import { cloneData } from "../../lib/clone";
import { populateServicesForPreBuiltGame } from "../../services/populateServices";
import { uploadFile } from "../../lib/files";
import { readGameFromZipFile } from "../../lib/zipFiles";
import imageService from "../../services/imageService";
import spriteSheetService from "../../services/spriteSheetService";
import spriteService from "../../services/spriteService";
import { Sprite } from "../../lib/Sprite";

const storageKey = "POINT_AND_CLICK";

interface Props {
  usePrebuiltGame?: boolean;
}



export default class GamePlayer extends Component<
  Props,
  {
    gameCondition?: GameCondition;
    gameDesign?: GameDesign;
    timestamp: number;
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      gameCondition: this.getInitialGameCondtions(),
      timestamp: Date.now(),
    };

    if (props.usePrebuiltGame) {
        populateServicesForPreBuiltGame()
    }

    this.save = this.save.bind(this);
    this.reset = this.reset.bind(this);
    this.load = this.load.bind(this);
  }

  save(data: GameData) {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  load() {
    const jsonString = localStorage.getItem(storageKey);
    if (!jsonString) {
      console.error("NO SAVE FILE", storageKey);
      return;
    }

    try {
      const data = JSON.parse(jsonString) as GameData;
      const loadedConditions = Object.assign(
        {},
        this.state.gameCondition,
        data
      );

      this.setState({
        timestamp: Date.now(),
        gameCondition: loadedConditions,
      });
    } catch (error) {
      console.error(error);
    }
  }

  reset() {
    this.setState({
      gameCondition: this.getInitialGameCondtions(),
      timestamp: Date.now(),
    });
  }

  getInitialGameCondtions(): GameCondition | undefined {
    const gameDesign = this.state?.gameDesign;
    const { usePrebuiltGame } = this.props;
    if (gameDesign) {
      return {
        ...cloneData(gameDesign),
        characterOrders: {},
      };
    }
    if (usePrebuiltGame) {
      return {
        ...cloneData(prebuiltGameDesign),
        characterOrders: {},
      };
    }
    return undefined;
  }

  uploadAll = async () => {
    const file = await uploadFile();
    if (!file) {
      return;
    }

    const result = await readGameFromZipFile(file);
    if (!result.success) {
      console.warn(result.error);
      return;
    }

    const { gameDesign, imageAssets } = result.data;
    const sprites = gameDesign.sprites.map((spriteData) => {
      return new Sprite(spriteData);
    });

    spriteSheetService.add(gameDesign.spriteSheets);
    imageService.add(imageAssets);
    spriteService.add(sprites);

    this.setState({ gameDesign }, () => {
      this.reset();
    });
  };

  render() {
    const { gameCondition, timestamp } = this.state;
    const { usePrebuiltGame } = this.props;
    return (
      <>
        {!usePrebuiltGame && (
          <div>
            <button onClick={this.uploadAll}>Load Game Design</button>
          </div>
        )}
        {gameCondition ? (
          <Game
            {...gameCondition}
            save={this.save}
            reset={this.reset}
            load={this.load}
            key={timestamp}
          />
        ) : (
          <div>
            <p>no game design loaded</p>
          </div>
        )}
      </>
    );
  }
}
