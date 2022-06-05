/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import spriteService from "../../services/spriteService";
import { SpriteData } from "../../definitions/SpriteSheet";
import { cloneData } from "../../lib/clone";
import { Sprite } from "../../lib/Sprite";

type SpriteEditorState = SpriteData & {

};

type SpriteEditorProps = {
    data?: SpriteData;
    assetList?: string[];
    saveFunction: { (data: SpriteData): void };
}

function getBlankSprite(): SpriteData {
    return {
        id: 'NEW_SPRITE',
        defaultDirection: 'left',
        animations: {

        }
    }
}

export class SpriteEditor extends Component<SpriteEditorProps, SpriteEditorState>{

    constructor(props: SpriteEditorProps) {
        super(props)

        const initialData = props.data ? cloneData(props.data) : getBlankSprite()

        this.state = {
            ...initialData
        }
        this.addSpriteToService = this.addSpriteToService.bind(this)
        this.handleSaveButton = this.handleSaveButton.bind(this)
    }

    addSpriteToService() {
        const spriteObject = new Sprite(this.state, [])
        spriteService.add(spriteObject)
    }

    handleSaveButton() {
        const data = cloneData(this.state);
        this.props.saveFunction(data)
    }

    render() {
        const { id } = this.state
        return <article>
            <h2>Sprite Editor</h2>
            <p>{id}</p>

            <button onClick={this.addSpriteToService}>Add to service</button>
            <button onClick={this.handleSaveButton}>Save to file</button>

            <h3>sprites</h3>
            {spriteService.list().map(id => <p key={id}>{id}</p>)}
        </article>
    }

}