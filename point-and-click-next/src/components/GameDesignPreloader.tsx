import { GameCondition, GameDesign } from "@/oldsrc";
import Game from "@/oldsrc/components/Game";
import { cloneData } from "@/oldsrc/lib/clone";
import imageService, { ImageAsset } from "@/oldsrc/services/imageService";
import soundService, { SoundAsset } from "@/oldsrc/services/soundService";
import React from "react";


type Props = {
    prebuiltGame: GameDesign;
    prebuiltImageAssets: ImageAsset[];
    prebuiltSoundAssets: SoundAsset[];
}

type State = {
    gameCondition?: GameCondition;
    timestamp: number;
}

export class GameDesignPreloader extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            timestamp: Date.now(),
        }
        this.reset = this.reset.bind(this)
    }

    reset() {
        this.setState({
          gameCondition: this.getInitialGameCondition(),
          timestamp: Date.now(),
        });
      }

    componentDidMount(): void {
        const {prebuiltImageAssets,prebuiltSoundAssets} =this.props
        imageService.add(prebuiltImageAssets)
        soundService.add(prebuiltSoundAssets)
        this.reset()
    }

    getInitialGameCondition(): GameCondition | undefined {
        const loadedGameDesign = this.props.prebuiltGame

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
        const { gameCondition, } = this.state
        return <div>
            {gameCondition && (
                <Game {...gameCondition} />
            )}
        </div>
    }

}