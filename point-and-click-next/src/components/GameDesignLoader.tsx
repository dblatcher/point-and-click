import { GameDesign } from "@/oldsrc";
import React from "react";
import { LoadDesignButton } from "./LoadDesignButton";
import { Test } from "./Test";


type State = {
    design?: GameDesign
}

export class GameDesignLoader extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props)
        this.state = {
            design: undefined
        }

        this.loadGameDesign = this.loadGameDesign.bind(this)
    }

    async loadGameDesign(design: GameDesign) {
        this.setState({ design }, () => {
            console.log('set')
        });
    }

    render() {

        const { design } = this.state

        return <div>
            <LoadDesignButton onLoad={this.loadGameDesign} onError={(err: string) => { console.warn(err) }} />

            {design && (
                <Test gameDesign={design} />
            )}
        </div>
    }

}