import { GameCondition, GameData, GameDesign } from "@/definitions";
import { Game } from "@/components/game/Game";
import { cloneData } from "@/lib/clone";
import { ImageAsset } from "@/services/assets";
import { populateServices } from "@/services/populateServices";
import { SoundAsset } from "@/services/assets";
import React from "react";
import { UiComponentSet } from "./game/uiComponentSet";
import { SpritesProvider } from "@/context/sprite-context";
import { Sprite } from "@/lib/Sprite";
import { GameDataSchema } from "@/definitions/Game";
import { AssetsProvider } from "@/context/asset-context";
import { ImageService } from "@/services/imageService";
import { SoundService } from "@/services/soundService";

const SAVED_GAME_PREFIX = 'POINT_AND_CLICK'
const SAVED_GAME_DELIMITER = "//"

type Props = {
  gameDesign: GameDesign;
  imageAssets: ImageAsset[];
  soundAssets: SoundAsset[];
  uiComponents?: UiComponentSet;
  instantMode?: boolean;
}

type State = {
  gameCondition?: GameCondition;
  timestamp: number;
}

export class GameDesignPlayer extends React.Component<Props, State> {

  sprites: Sprite[]
  soundService: SoundService
  imageService: ImageService

  constructor(props: Props) {
    super(props)
    this.state = {
      timestamp: Date.now(),
    }
    this.reset = this.reset.bind(this)
    this.save = this.save.bind(this)
    this.load = this.load.bind(this)
    this.listSavedGames = this.listSavedGames.bind(this)
    this.deleteSave = this.deleteSave.bind(this)

    this.sprites = []
    this.soundService = new SoundService()
    this.imageService = new ImageService()
  }

  getStorageKey(fileName: string): string | undefined {
    const { gameCondition } = this.state;
    return gameCondition ? [SAVED_GAME_PREFIX, gameCondition.id, fileName].join(SAVED_GAME_DELIMITER) : undefined;
  }

  save(data: GameData, fileName = 'saved-game') {
    const storageKey = this.getStorageKey(fileName)
    if (!storageKey) {
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  listSavedGames(): string[] {
    const { gameCondition } = this.state;
    if (!gameCondition) {
      return []
    }
    const prefixAndIdAndTrailingDelimiter = [SAVED_GAME_PREFIX, gameCondition.id, ''].join(SAVED_GAME_DELIMITER)
    return Object.keys(localStorage)
      .filter(key => key.startsWith(prefixAndIdAndTrailingDelimiter))
      .map(key => key.substring(prefixAndIdAndTrailingDelimiter.length))
  }

  deleteSave(fileName: string) {
    const storageKey = this.getStorageKey(fileName)
    console.log('DELETE SAVE', fileName, storageKey)
    if (storageKey) {
      localStorage.removeItem(storageKey)
    }
  }

  load(fileName = 'saved-game') {
    const storageKey = this.getStorageKey(fileName)
    if (!storageKey) {
      return;
    }
    const jsonString = localStorage.getItem(storageKey);
    if (!jsonString) {
      console.error("NO SAVE FILE", storageKey);
      return;
    }

    try {
      const data = JSON.parse(jsonString) as unknown;
      const parse = GameDataSchema.safeParse(data)
      if (!parse.success) {
        console.warn(parse.error)
        throw new Error('parse fail')
      }
      if (parse.data.id !== this.props.gameDesign.id) {
        throw new Error('Not from the right game - ids do not match')
      }
      const loadedConditions = {
        ...this.state.gameCondition,
        ...parse.data,
      }
      this.setState({
        timestamp: Date.now(),
        gameCondition: loadedConditions as GameCondition,
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

  componentDidMount(): void {
    const { soundService, imageService } = this
    const { gameDesign, imageAssets, soundAssets } = this.props
    this.sprites.push(...gameDesign.sprites.map((data) => new Sprite(data, imageService.get.bind(imageService))))
    populateServices(gameDesign, imageAssets, soundAssets, imageService, soundService)
    this.reset()
  }

  getInitialGameCondition(): GameCondition | undefined {
    const loadedGameDesign = this.props.gameDesign
    if (loadedGameDesign) {
      return {
        ...cloneData(loadedGameDesign),
        gameNotBegun: true,
        actorOrders: {},
      };
    }
    return undefined;
  }


  render() {
    const { soundService, imageService } = this
    const { gameCondition, timestamp } = this.state
    const { uiComponents, instantMode } = this.props
    return (
      <AssetsProvider imageService={imageService} soundService={soundService}>
        <SpritesProvider value={this.sprites}>
          {gameCondition && (
            <Game
              {...gameCondition}
              load={this.load}
              save={this.save}
              deleteSave={this.deleteSave}
              listSavedGames={this.listSavedGames}
              reset={this.reset}
              key={timestamp}
              _sprites={this.sprites}
              uiComponents={uiComponents}
              instantMode={instantMode}
              soundService={soundService}
            />
          )}
        </SpritesProvider>
      </AssetsProvider>
    )
  }
}