/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h, Fragment } from "preact";
import { GameCondition, GameData, GameDesign } from "src";
import Game from "../Game";
import { cloneData } from "../../lib/clone";
import { populateServices } from "../../services/populateServices";
import { uploadFile } from "../../lib/files";
import { readGameFromZipFile } from "../../lib/zipFiles";
import { ImageAsset } from "../../services/imageService";

const storageKey = "POINT_AND_CLICK";

interface Props {
  prebuiltGame?: GameDesign;
  prebuiltAssets?: ImageAsset[];
}

export default class GamePlayer extends Component<
  Props,
  {
    gameCondition?: GameCondition;
    loadedGameDesign?: GameDesign;
    timestamp: number;
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      gameCondition: this.getInitialGameCondition(),
      timestamp: Date.now(),
    };

    if (props.prebuiltGame) {
      populateServices(props.prebuiltGame, props.prebuiltAssets || []);
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
      gameCondition: this.getInitialGameCondition(),
      timestamp: Date.now(),
    });
  }

  getInitialGameCondition(): GameCondition | undefined {
    const loadedGameDesign = this.state?.loadedGameDesign;
    const { prebuiltGame } = this.props;
    if (loadedGameDesign) {
      return {
        ...cloneData(loadedGameDesign),
        characterOrders: {},
      };
    }
    if (prebuiltGame) {
      return {
        ...cloneData(prebuiltGame),
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
    populateServices(gameDesign, imageAssets)

    this.setState({ loadedGameDesign: gameDesign }, () => {
      this.reset();
    });
  };

  render() {
    const { gameCondition, timestamp } = this.state;
    const { prebuiltGame } = this.props;
    return (
      <>
        {!prebuiltGame && (
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
