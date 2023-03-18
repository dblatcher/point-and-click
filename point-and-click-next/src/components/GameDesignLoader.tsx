import { GameCondition, GameDesign } from "@/oldsrc";
import Game from "@/oldsrc/components/Game";
import { cloneData } from "@/oldsrc/lib/clone";
import React from "react";
import { LoadDesignButton } from "./LoadDesignButton";
import { Test } from "./Test";


type State = {
    design?: GameDesign
    gameCondition?: GameCondition;
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

    async loadGameDesign(design: GameDesign) {
        this.setState({ design }, () => {
            const gameCondition = this.getInitialGameCondition()
            this.setState({
                gameCondition,
                timestamp: Date.now(),
            })
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

        const { design, gameCondition, } = this.state

        return <div>
            <LoadDesignButton onLoad={this.loadGameDesign} onError={(err: string) => { console.warn(err) }} />

            {design && (
                <Test gameDesign={design} />
            )}

            {gameCondition && (
                <Game {...gameCondition}/>
            )}
        </div>
    }

}