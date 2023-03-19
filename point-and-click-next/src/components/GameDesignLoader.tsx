import { GameCondition, GameDesign } from "@/oldsrc";
import { cloneData } from "@/oldsrc/lib/clone";
import { ImageAsset } from "@/oldsrc/services/imageService";
import { SoundAsset } from "@/oldsrc/services/soundService";
import React from "react";
import { GameDesignPlayer } from "./GameDesignPlayer";
import { LoadDesignButton } from "./LoadDesignButton";


type State = {
    design?: GameDesign
    imageAssets?: ImageAsset[]
    soundAssets?: SoundAsset[]
    timestamp: number;
}

export class GameDesignLoader extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props)
        this.state = {
            design: undefined,
            timestamp: Date.now(),
        }

        this.loadGameDesign = this.loadGameDesign.bind(this)
    }

    async loadGameDesign(design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]) {
        this.setState({
            design,
            imageAssets,
            soundAssets,
            timestamp: Date.now(),
        });
    }


    getInitialGameCondition(): GameCondition | undefined {
        const loadedGameDesign = this.state?.design;

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
        const { design, imageAssets = [], soundAssets = [] } = this.state
        return <div>
            <LoadDesignButton onLoad={this.loadGameDesign} onError={(err: string) => { console.warn(err) }} />

            {design && (
                <GameDesignPlayer
                    gameDesign={design}
                    imageAssets={imageAssets}
                    soundAssets={soundAssets}
                />
            )}
        </div>
    }

}