/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import spriteService from "../../services/spriteService";
import { Direction, SpriteData, SpriteFrame } from "../../definitions/SpriteSheet";
import { cloneData } from "../../lib/clone";
import { Sprite } from "../../lib/Sprite";
import { readJsonFile, uploadFile } from "../../lib/download";
import { isSpriteData } from "../../lib/typeguards";

import { SpritePreview } from "./SpirtePreview";
import { ThingData } from "../../definitions/ThingData"

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
        this.handleLoadButton = this.handleLoadButton.bind(this)
    }

    addSpriteToService() {
        const spriteObject = new Sprite(this.state)
        spriteService.add(spriteObject)
    }

    handleSaveButton() {
        const data = cloneData(this.state);
        this.props.saveFunction(data)
    }
    handleLoadButton = async () => {
        const file = await uploadFile();
        const { data, error } = await readJsonFile(file)

        if (error) {
            console.warn(error)
        }

        if (isSpriteData(data)) {
            this.setState(data)
        } else {
            console.warn("NOT SPRITE DATA", data)
        }
    }

    buildSprite(): Sprite {
        // to do - get sheets from a sprite sheet service?
        return new Sprite(this.state)
    }

    buildThingData(animation: string, direction: Direction): ThingData {
        const { state } = this

        return {
            type: 'thing',
            id: 'preview',
            x: 50, y: 0,
            height: 100, width: 100,
            sprite: state.id,
            status: animation,
            direction
        }
    }

    render() {
        const { id, defaultDirection, animations } = this.state
        return <article>
            <h2>Sprite Editor</h2>
            <p>
                <b>ID:</b>
                <span>{id}</span>
            </p>
            <p>
                <b>defaultDirection:</b>
                <span>{defaultDirection}</span>
            </p>
            <p>
                <b>animations:</b>
                <ul style={{ display: 'flex' }}>
                    {Object.keys(animations).map(animKey => (
                        <li key={animKey}>
                            <b>{animKey}</b>
                            <ul>
                                {(Object.keys(animations[animKey]) as Direction[]).map(dirKey => (
                                    <li key={dirKey}>
                                        <em>{dirKey}</em>
                                        <ul>
                                            {(animations[animKey][dirKey] as SpriteFrame[]).map((frame, index) => (
                                                <li key={index}>
                                                    <span>{frame.sheetId}</span>
                                                    <span>[{frame.col}, {frame.row}]</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <SpritePreview
                                            overrideSprite={this.buildSprite()}
                                            data={this.buildThingData(animKey, dirKey)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </p>


            <button onClick={this.addSpriteToService}>Add to service</button>
            <button onClick={this.handleSaveButton}>Save to file</button>
            <button onClick={this.handleLoadButton}>load from file</button>

            <h3>sprites</h3>
            {spriteService.list().map(id => <p key={id}>{id}</p>)}
        </article>
    }
}