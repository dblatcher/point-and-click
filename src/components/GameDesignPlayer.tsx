import { Game } from "@/components/game/Game";
import { AssetsProvider } from "@/context/asset-context";
import { SavedGameContext } from "@/context/saved-game-context";
import { SpritesProvider } from "@/context/sprite-context";
import { GameDesign } from "@/definitions";
import { Sprite } from "@/lib/Sprite";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { ImageService } from "@/services/imageService";
import { populateServices } from "@/services/populateServices";
import { SoundService } from "@/services/soundService";
import React from "react";
import { UiComponentSet } from "./game/uiComponentSet";

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

  render() {
    const { soundService, imageService } = this
    const { ready } = this.state
    const { uiComponents, instantMode, gameDesign } = this.props
    return (
      <AssetsProvider imageService={imageService} soundService={soundService}>
        <SavedGameContext.Provider value={{ gameId: gameDesign.id }}>
          <SpritesProvider value={this.sprites}>
            {ready && (
              <Game
                {...gameDesign}
                _sprites={this.sprites}
                uiComponents={uiComponents}
                instantMode={instantMode}
                soundService={soundService}
              />
            )}
          </SpritesProvider>
        </SavedGameContext.Provider>
      </AssetsProvider>
    )
  }
}