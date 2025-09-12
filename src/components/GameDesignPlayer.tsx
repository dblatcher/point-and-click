import { Game } from "@/components/game/Game";
import { AssetsProvider } from "@/context/asset-context";
import { SpritesProvider } from "@/context/sprite-context";
import { GameData, GameDesign } from "@/definitions";
import { GameDataSchema } from "@/definitions/Game";
import { Sprite } from "@/lib/Sprite";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { ImageService } from "@/services/imageService";
import { populateServices } from "@/services/populateServices";
import { SoundService } from "@/services/soundService";
import React from "react";
import { UiComponentSet } from "./game/uiComponentSet";

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
  ready: boolean
}

export class GameDesignPlayer extends React.Component<Props, State> {

  sprites: Sprite[]
  soundService: SoundService
  imageService: ImageService

  constructor(props: Props) {
    super(props)
    this.state = {
      ready: false
    }
    this.save = this.save.bind(this)
    this.load = this.load.bind(this)
    this.listSavedGames = this.listSavedGames.bind(this)
    this.deleteSave = this.deleteSave.bind(this)

    this.sprites = []
    this.soundService = new SoundService()
    this.imageService = new ImageService()
  }

  componentDidMount(): void {
    const { soundService, imageService } = this
    const { gameDesign, imageAssets, soundAssets } = this.props
    this.sprites.push(...gameDesign.sprites.map((data) => new Sprite(data, imageService.get.bind(imageService))))
    populateServices(gameDesign, imageAssets, soundAssets, imageService, soundService)
    this.setState({
      ready: true
    });
  }

  getStorageKey(fileName: string): string | undefined {
    const { gameDesign } = this.props;
    return [SAVED_GAME_PREFIX, gameDesign.id, fileName].join(SAVED_GAME_DELIMITER);
  }

  save(data: GameData, fileName = 'saved-game') {
    const storageKey = this.getStorageKey(fileName)
    if (!storageKey) {
      return;
    }
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  listSavedGames(): string[] {
    const { gameDesign } = this.props;
    const prefixAndIdAndTrailingDelimiter = [SAVED_GAME_PREFIX, gameDesign.id, ''].join(SAVED_GAME_DELIMITER)
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

  load(callback: { (data: GameData): void }, fileName = 'saved-game') {
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
      const gameDataparseResult = GameDataSchema.safeParse(data);

      if (!gameDataparseResult.success) {
        console.warn(gameDataparseResult.error.issues)
        throw new Error('parse fail')
      }
      if (gameDataparseResult.data.id !== this.props.gameDesign.id) {
        throw new Error('Not from the right game - ids do not match')
      }
      callback(gameDataparseResult.data)

    } catch (error) {
      console.error(error);
    }
  }


  render() {
    const { soundService, imageService } = this
    const { ready } = this.state
    const { uiComponents, instantMode, gameDesign } = this.props
    return (
      <AssetsProvider imageService={imageService} soundService={soundService}>
        <SpritesProvider value={this.sprites}>
          {ready && (
            <Game
              {...gameDesign}
              load={this.load}
              save={this.save}
              deleteSave={this.deleteSave}
              listSavedGames={this.listSavedGames}
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