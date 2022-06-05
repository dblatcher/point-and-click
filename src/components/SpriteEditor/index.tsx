/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { SpriteData } from "../../definitions/SpriteSheet";
import { cloneData } from "../../lib/clone";

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
    }

    render() {
        const { id } = this.state
        return <article>
            <h2>Sprite Editor</h2>
            <p>{id}</p>
        </article>
    }

}