/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import spriteService from "../../services/spriteService";
import spriteSheetService from "../../services/spriteSheetService";
import { Direction, directions, SpriteData, SpriteFrame } from "../../definitions/SpriteSheet";
import { cloneData } from "../../lib/clone";
import { Sprite } from "../../lib/Sprite";
import { readJsonFile, uploadFile } from "../../lib/files";
import { isSpriteData } from "../../lib/typeguards";

import { SpritePreview } from "./SpritePreview";
import { ThingData } from "../../definitions/ThingData"
import { ServiceItemSelector } from "../ServiceItemSelector";
import { ServiceItem } from "../../services/Service";
import styles from '../editorStyles.module.css';
import { TextInput } from "../formControls";
import { eventToString } from "../../lib/util";
import { NewAnimationForm } from "./NewAnimationForm";

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
            default: {
                left: []
            }
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
        this.openSpriteFromService = this.openSpriteFromService.bind(this)
        this.addAnimation = this.addAnimation.bind(this)
    }

    changeValue(propery: keyof SpriteData, newValue: string) {
        const modification: Partial<SpriteEditorState> = {}
        switch (propery) {
            case 'id':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue.toUpperCase()
                }
                break;
            case 'defaultDirection':
                if (directions.includes(newValue as Direction)) {
                    modification[propery] = newValue as Direction
                }
                break;
        }
        this.setState(modification)
    }

    addAnimation(animationKey: string) {
        console.log({ animationKey })
        this.setState(state => {
            const { animations, defaultDirection } = state
            const newAnimation: Partial<Record<Direction, SpriteFrame[] | undefined>> = {}
            newAnimation[defaultDirection] = []
            animations[animationKey] = newAnimation
            return { animations }
        })
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
    openSpriteFromService(item: ServiceItem) {
        if (!(item instanceof Sprite)) {
            return
        }
        this.setState(item.data)
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
            <div className={styles.container}>
                <section>

                    <fieldset className={styles.fieldset}>
                        <div className={styles.row}>
                            <TextInput label="sprite ID" value={id} onInput={event => this.changeValue('id', eventToString(event))} />
                        </div>
                        <div className={styles.row}>
                            <label>Default Direction</label>
                            <select value={defaultDirection} onChange={event => this.changeValue('defaultDirection', eventToString(event))}>
                                {directions.map(direction =><option key={direction}>{direction}</option>)}
                            </select>
                        </div>
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend>animations</legend>

                        <NewAnimationForm existingKeys={Object.keys(this.state.animations)} submit={this.addAnimation} />
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend>storage</legend>
                        <button onClick={this.addSpriteToService}>Add to service</button>
                        <button onClick={this.handleSaveButton}>Save to file</button>
                        <button onClick={this.handleLoadButton}>load from file</button>
                    </fieldset>
                </section>
                <section>

                    <ul >
                        {Object.keys(animations).map(animKey => (
                            <li key={animKey}>
                                <b>{animKey}</b>
                                <ul style={{ display: 'flex' }}>
                                    {(Object.keys(animations[animKey]) as Direction[]).map(dirKey => (
                                        <li key={dirKey}>
                                            <em>{dirKey}{dirKey === defaultDirection && '(default)'}</em>
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

                </section>
            </div>

            <section style={{ display: 'flex' }}>
                <ServiceItemSelector legend="open sprite"
                    service={spriteService} select={this.openSpriteFromService} />
                <ServiceItemSelector legend="pick sheet"
                    service={spriteSheetService} select={(item) => { console.log(item) }} />
            </section>
        </article >
    }
}