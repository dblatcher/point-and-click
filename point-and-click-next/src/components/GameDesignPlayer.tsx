import { GameCondition, GameData, GameDesign } from "@/oldsrc";
import Game from "@/components/game";
import { cloneData } from "@/lib/clone";
import { ImageAsset } from "@/services/imageService";
import { populateServices } from "@/services/populateServices";
import { SoundAsset } from "@/services/soundService";
import React from "react";
import { CommandLine } from "./game-mui-ux/CommandLine";
import { VerbMenu } from "./game-mui-ux/VerbMenu";
import { ItemMenu } from "./game-mui-ux/ItemMenu";
import { SaveMenu } from "./game-mui-ux/SaveMenu";


type Props = {
    gameDesign: GameDesign;
    imageAssets: ImageAsset[];
    soundAssets: SoundAsset[];
}

type State = {
    gameCondition?: GameCondition;
    timestamp: number;
}

export class GameDesignPlayer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            timestamp: Date.now(),
        }
        this.reset = this.reset.bind(this)
        this.save = this.save.bind(this)
        this.load = this.load.bind(this)
    }

    get storageKey(): string | undefined {
        const { gameCondition } = this.state;
        return gameCondition ? `POINT_AND_CLICK_${gameCondition.id}` : undefined;
      }

    save(data:GameData) {
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

    componentDidMount(): void {
        const { gameDesign, imageAssets, soundAssets } = this.props
        populateServices(gameDesign, imageAssets, soundAssets)
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
        const { gameCondition, timestamp } = this.state
        return <div>
            {gameCondition && (
                <Game 
                    {...gameCondition} 
                    load={this.load} 
                    save={this.save} 
                    reset={this.reset} 
                    key={timestamp} 
                    
                    CommandLineComponent={CommandLine}
                    VerbMenuComponent={VerbMenu}
                    ItemMenuComponent={ItemMenu}
                    SaveMenuComponent={SaveMenu}
                    />
            )}
        </div>
    }

}