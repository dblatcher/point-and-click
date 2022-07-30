/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { directions,  SpriteDataSchema } from "../../../definitions/SpriteSheet";
import { cloneData } from "../../../lib/clone";
import { Sprite } from "../../../lib/Sprite";
import { uploadJsonData } from "../../../lib/files";
import { eventToString } from "../../../lib/util";
import { CharacterData, Direction,SpriteData, SpriteFrame } from "src"
import { DeleteButton, TextInput } from "../formControls";
import { NewAnimationForm } from "./NewAnimationForm";
import { AnimationControl } from "./AnimationControl";
import spriteService from "../../../services/spriteService";
import { FramePicker } from "./FramePicker";
import styles from '../editorStyles.module.css';
import { StorageMenu } from "../StorageMenu";

type ExtraState = {
    selectedAnimation?: string;
    selectedRow: number;
    selectedCol: number;
    selectedSheetId?: string;
}

type SpriteEditorState = SpriteData & ExtraState;

type SpriteEditorProps = {
    data?: SpriteData;
    updateData?: { (data: SpriteData): void };
    spriteIds: string[];
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
        this.handleNewButton = this.handleNewButton.bind(this)
        this.handleLoadButton = this.handleLoadButton.bind(this)
        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
        this.addAnimation = this.addAnimation.bind(this)
        this.editCycle = this.editCycle.bind(this)
        this.buildCharacterData = this.buildCharacterData.bind(this)
        this.pickFrame = this.pickFrame.bind(this)
    }

    get currentData(): SpriteData {
        const data = cloneData(this.state as SpriteData & Partial<ExtraState>);
        delete data.selectedAnimation;
        delete data.selectedRow;
        delete data.selectedCol;
        delete data.selectedSheetId;
        return data
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

    handleNewButton() {
        const newSprite = getBlankSprite()
        this.setState(newSprite)
    }
    handleLoadButton = async () => {
        const { data, error } = await uploadJsonData(SpriteDataSchema)
        if (data) {
            this.setState(data)
        } else {
            console.warn("NOT SPRITE DATA", error)
        }
    }

    handleResetButton() {
        const { props } = this
        const initialState = props.data ? cloneData(props.data) : getBlankSprite()
        this.setState({
            ...initialState
        })
    }
    handleUpdateButton() {
        const { currentData } = this
        const spriteObject = new Sprite(currentData)
        spriteService.add(spriteObject)
        if (this.props.updateData) {
            this.props.updateData(currentData)
        }
    }

    buildSprite(): Sprite {
        // to do - get sheets from a sprite sheet service?
        return new Sprite(this.state)
    }

    buildCharacterData(animation: string, direction: Direction): CharacterData {
        const { state } = this
        const sheet = spriteService.get(state.id)?.getFrame(animation, 0, direction)?.sheet
        const widthScale = sheet?.widthScale || 1
        const heightScale = sheet?.heightScale || 1

        return {
            type: 'character',
            id: 'preview',
            x: 75 / widthScale, y: 0,
            height: 150 / heightScale, width: 150 / widthScale,
            sprite: state.id,
            status: animation,
            direction
        }
    }

    render() {
        const { id, defaultDirection, animations, selectedAnimation, selectedCol, selectedRow, selectedSheetId } = this.state
        const { spriteIds } = this.props
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

                    <StorageMenu
                        data={this.currentData}
                        originalId={this.props.data?.id}
                        existingIds={spriteIds}
                        type='sprite'
                        update={this.handleUpdateButton}
                        reset={this.handleResetButton}
                        saveButton={true}
                        load={this.handleLoadButton}
                    />
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
                            buildCharacterData={this.buildCharacterData}
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