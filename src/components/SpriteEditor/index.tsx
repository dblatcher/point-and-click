/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { Direction, directions, SpriteData, SpriteFrame } from "../../definitions/SpriteSheet";
import { cloneData } from "../../lib/clone";
import { Sprite } from "../../lib/Sprite";
import { readJsonFile, uploadFile } from "../../lib/files";
import { isSpriteData } from "../../lib/typeguards";
import { eventToString } from "../../lib/util";
import { ThingData } from "../../definitions/ThingData"
import { ServiceItemSelector } from "../ServiceItemSelector";
import { DeleteButton, TextInput } from "../formControls";
import { NewAnimationForm } from "./NewAnimationForm";
import { AnimationControl } from "./AnimationControl";
import { ServiceItem } from "../../services/Service";
import spriteService from "../../services/spriteService";
import { FramePicker } from "./FramePicker";
import styles from '../editorStyles.module.css';

type SpriteEditorState = SpriteData & {
    selectedAnimation?: string;
    selectedRow: number;
    selectedCol: number;
    selectedSheetId?: string;
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
            ...initialData,
            selectedAnimation: 'default',
            selectedCol: 0,
            selectedRow: 0,
        }
        this.addSpriteToService = this.addSpriteToService.bind(this)
        this.handleNewButton = this.handleNewButton.bind(this)
        this.handleSaveButton = this.handleSaveButton.bind(this)
        this.handleLoadButton = this.handleLoadButton.bind(this)
        this.openSpriteFromService = this.openSpriteFromService.bind(this)
        this.addAnimation = this.addAnimation.bind(this)
        this.editCycle = this.editCycle.bind(this)
        this.buildThingData = this.buildThingData.bind(this)
        this.pickFrame = this.pickFrame.bind(this)
    }

    pickFrame(selectedRow: number, selectedCol: number, selectedSheetId?: string) {
        this.setState({
            selectedCol, selectedRow, selectedSheetId
        })
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
        this.setState(state => {
            const { animations, defaultDirection } = state
            const newAnimation: Partial<Record<Direction, SpriteFrame[] | undefined>> = {}
            newAnimation[defaultDirection] = []
            animations[animationKey] = newAnimation
            return { animations }
        })
    }

    deleteAnimation(animationKey: string) {
        this.setState(state => {
            const { animations } = state
            delete animations[animationKey]
            return { animations }
        })
    }

    editCycle(animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined) {
        this.setState(state => {
            const { animations, defaultDirection } = state
            const animation = animations[animationKey]
            if (!animation) { return {} }

            if (newValue) {
                animation[direction] = newValue
            } if (direction !== defaultDirection && !newValue) {
                delete animation[direction]
            }
            return { animations }
        })
    }

    addSpriteToService() {
        const spriteObject = new Sprite(this.state)
        spriteService.add(spriteObject)
    }

    handleNewButton() {
        const newSprite = getBlankSprite()
        this.setState(newSprite)
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
        const { id, defaultDirection, animations, selectedAnimation, selectedCol, selectedRow, selectedSheetId } = this.state
        const overrideSprite = this.buildSprite()
        return <article>
            <h2>Sprite Editor</h2>
            <div className={styles.container}>
                <section>

                    <fieldset className={styles.fieldset}>
                        <div className={styles.row}>
                            <TextInput label="sprite ID" value={id} onInput={event => this.changeValue('id', eventToString(event))} />
                        </div>
                        <DeleteButton label="New sprite"
                            confirmationText="Are you sure you want to reset this form?"
                            onClick={this.handleNewButton} />
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend>animations</legend>
                        <div className={styles.row}>
                            <label>Default Direction</label>
                            <select value={defaultDirection} onChange={event => this.changeValue('defaultDirection', eventToString(event))}>
                                {directions.map(direction => <option key={direction}>{direction}</option>)}
                            </select>
                        </div>


                        <NewAnimationForm existingKeys={Object.keys(this.state.animations)} submit={this.addAnimation} />
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend>Pick Frame</legend>
                        <FramePicker
                            pickFrame={this.pickFrame}
                            sheetId={selectedSheetId}
                            row={selectedRow}
                            col={selectedCol}
                        />
                    </fieldset>

                    <fieldset className={styles.fieldset}>
                        <legend>storage</legend>
                        <button onClick={this.handleSaveButton}>Save to file</button>
                        <button onClick={this.handleLoadButton}>load from file</button>
                        <div>
                            <button onClick={this.addSpriteToService}>
                                {spriteService.list().includes(id) ? 'update in service' : 'Add to service'}
                            </button>
                            <ServiceItemSelector legend="open from service"
                                format="select"
                                selectedItemId={id}
                                service={spriteService}
                                select={this.openSpriteFromService} />
                        </div>
                    </fieldset>
                </section>

                <section>

                    <div className={styles.row}>
                        <label>Edit Animation:</label>
                        <select value={selectedAnimation}
                            onChange={
                                event => { this.setState({ selectedAnimation: eventToString(event) }) }
                            }>
                            {Object.keys(this.state.animations).map(animKey => (
                                <option key={animKey}>{animKey}</option>
                            ))}
                        </select>
                    </div>

                    {(selectedAnimation && animations[selectedAnimation]) && (
                        <AnimationControl animKey={selectedAnimation}
                            defaultDirection={defaultDirection}
                            animation={animations[selectedAnimation]}
                            overrideSprite={overrideSprite}
                            buildThingData={this.buildThingData}
                            deleteAll={() => this.deleteAnimation(selectedAnimation)}
                            editCycle={this.editCycle}
                            selectedFrame={selectedSheetId ? {
                                row: selectedRow,
                                col: selectedCol,
                                sheetId: selectedSheetId,
                            } : undefined}
                        />
                    )}
                </section>
            </div>
        </article >
    }
}