import { GameDesign } from "@/oldsrc";
import { uploadFile } from "@/oldsrc/lib/files";
import { readGameFromZipFile } from "@/oldsrc/lib/zipFiles";
import { populateServices } from "@/oldsrc/services/populateServices";
import React from "react";


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

    async loadGameDesign() {
        console.log('load')

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
        console.log({ gameDesign, imageAssets, soundAssets })
        populateServices(gameDesign, imageAssets, soundAssets);

        this.setState({ design: gameDesign }, () => {
            console.log('set')
        });
    }

    render() {

        return <div>
            <button onClick={this.loadGameDesign}>load game</button>
            <span>{this.state.design?.id}</span>
        </div>
    }

}