/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from "react";
import { GameCondition, GameData, GameDesign } from "../../";
import Game from "../Game";
import { cloneData } from "../../../lib/clone";
import { populateServices } from "../../../services/populateServices";
import { uploadFile } from "../../../lib/files";
import { readGameFromZipFile } from "../../../lib/zipFiles";
import { ImageAsset } from "../../../services/imageService";
import { SoundAsset } from "../../../services/soundService";

interface Props {
  prebuiltGame?: GameDesign;
  prebuiltImageAssets?: ImageAsset[];
  prebuiltSoundAssets?: SoundAsset[];
}

interface State {
  gameCondition?: GameCondition;
  loadedGameDesign?: GameDesign;
  timestamp: number;
}

export default class GamePlayer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      gameCondition: this.getInitialGameCondition(),
      timestamp: Date.now(),
    };

    if (props.prebuiltGame) {
      populateServices(
        props.prebuiltGame,
        props.prebuiltImageAssets || [],
        props.prebuiltSoundAssets || []);
    }

    this.save = this.save.bind(this);
    this.reset = this.reset.bind(this);
    this.load = this.load.bind(this);
  }

  save(data: GameData) {
    if (!this.storageKey) {
      return;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  load() {
    if (!this.storageKey) {
      return;
    }
    const jsonString = localStorage.getItem(this.storageKey);
    if (!jsonString) {
      console.error("NO SAVE FILE", this.storageKey);
      return;
    }

    try {
      // TO DO - PARSE WITH SCHEMA!!
      // CHECK GAME ID!!
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
        gameNotBegun: true,
        actorOrders: {},
      };
    }
    if (prebuiltGame) {
      return {
        ...cloneData(prebuiltGame),
        gameNotBegun: true,
        actorOrders: {},
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

    const { gameDesign, imageAssets, soundAssets } = result.data;
    populateServices(gameDesign, imageAssets, soundAssets);

    this.setState({ loadedGameDesign: gameDesign }, () => {
      this.reset();
    });
  };

  get storageKey(): string | undefined {
    const { gameCondition } = this.state;
    return gameCondition ? `POINT_AND_CLICK_${gameCondition.id}` : undefined;
  }

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
