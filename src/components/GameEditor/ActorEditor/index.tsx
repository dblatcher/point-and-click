/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { ActorData, Direction, RoomData, Point } from "src";
import { ActorDataSchema, SoundValue } from "../../../definitions/ActorData";
import { directions } from "../../../definitions/SpriteSheet";
import { CheckBoxInput, IdentInput, NumberInput, OptionalNumberInput, SelectInput, TextInput } from "../formControls";
import { ServiceItemSelector } from "../ServiceItemSelector";
import spriteService from "../../../services/spriteService";
import { SpritePreview } from "../SpritePreview";
import { StorageMenu } from "../StorageMenu";
import { cloneData } from "../../../lib/clone";
import { eventToString, findById, listIds } from "../../../lib/util";
import { uploadJsonData } from "../../../lib/files";
import styles from "../editorStyles.module.css"
import { PositionPreview } from "./PositionPreview";
import { DataItemEditorProps } from "../dataEditors";
import { RecordEditor } from "../RecordEditor";
import { SoundValueForm } from "./SoundValueForm";

type ExtraState = {

}

type State = ActorData & { sprite: string | undefined } & ExtraState;

type Props = DataItemEditorProps<ActorData> & {
    rooms: RoomData[];
    actorIds: string[];
    actors: ActorData[];
}

const makeBlankActor = (): ActorData => ({
    id: 'NEW_ACTOR',
    type: 'actor',
    name: undefined,
    status: undefined,

    sprite: spriteService.list()[0],
    direction: 'left',
    height: 150, width: 100,
    x: 0, y: 0, room: undefined,

    isPlayer: false,
    speed: 3,
    dialogueColor: '#000000',

})

const newSound = (): SoundValue => ({ soundId: "beep" })

export class ActorEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)

        const initialState = props.data ? {
            ...props.data
        } : makeBlankActor()

        this.state = {
            ...initialState
        }

        this.handleLoadButton = this.handleLoadButton.bind(this)
        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
        this.handlePreviewClick = this.handlePreviewClick.bind(this)
        this.changeSoundMap = this.changeSoundMap.bind(this)
    }

    get currentData(): ActorData {
        const actorData = cloneData(this.state) as State;
        return actorData
    }

    changeValue(propery: keyof ActorData, newValue: unknown) {
        const modification: Partial<State> = {}
        switch (propery) {
            case 'id':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue.toUpperCase()
                }
                break;
            case 'name':
            case 'room':
            case 'status':
            case 'filter':
            case 'dialogueColor':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue
                }
                break;
            case 'direction':
                if (typeof newValue === 'string' && directions.includes(newValue as Direction)) {
                    modification[propery] = newValue as Direction
                }
                break;
            case 'width':
            case 'height':
            case 'x':
            case 'y':
            case 'speed':
            case 'baseline':
                if (typeof newValue === 'number') {
                    modification[propery] = newValue
                }
                break;
            case 'isPlayer':
            case 'noInteraction':
                if (typeof newValue === 'boolean' || typeof newValue === 'undefined') {
                    modification[propery] = newValue || undefined
                }
                break;
            case 'walkToX':
            case 'walkToY':
                if (typeof newValue === 'number' || typeof newValue === 'undefined') {
                    modification[propery] = newValue
                }
                break;
        }
        this.setState(modification)
    }
    changeSoundMap(key: string, value?: SoundValue): void {
        this.setState(state => {
            const { soundEffectMap = {} } = state
            if (typeof value === 'undefined') {
                delete soundEffectMap[key]
            } else {
                soundEffectMap[key] = value
            }
            return { soundEffectMap }
        })
    }
    handleLoadButton = async () => {
        const { data, error } = await uploadJsonData(ActorDataSchema)
        if (data) {
            this.setState(data)
        } else {
            console.warn("NOT ACTOR DATA", error)
        }
    }
    handleResetButton() {
        const { props } = this
        const initialState = props.data ? cloneData(props.data) : makeBlankActor()
        this.setState({
            ...initialState
        })
    }
    handleUpdateButton() {
        if (this.props.updateData) {
            this.props.updateData(this.currentData)
        }
    }
    handlePreviewClick(point: Point) {
        this.setState(point)
    }

    get previewData(): ActorData {
        return {
            ...this.state,
            x: this.state.width / 2, y: 0
        }
    }

    get spriteAnimations(): string[] {
        const { sprite: spriteId } = this.state
        const sprite = spriteService.get(spriteId)
        if (!sprite) { return [] }
        return Object.keys(sprite.data.animations)
    }

    get otherActorsInRoom(): ActorData[] {
        const { actors } = this.props
        const { id, room } = this.state
        const originalId = this.props.data?.id

        return actors.filter(actor =>
            actor.id !== id &&
            actor.id !== originalId &&
            actor.room === room
        )
    }

    render() {
        const { state } = this
        const { sprite: spriteId, width = 1, height = 1, soundEffectMap = {}, walkToX, walkToY } = state
        const { actorIds } = this.props

        return (
            <article>
                <h2>Actor Editor</h2>

                <div className={styles.rowTopLeft}>
                    <fieldset>
                        <legend>Actor</legend>
                        <IdentInput value={state}
                            onChangeId={(event) => this.changeValue('id', eventToString(event))}
                            onChangeName={(event) => this.changeValue('name', eventToString(event))}
                            onChangeStatus={(event) => this.changeValue('status', eventToString(event))}
                        />
                        <SelectInput label="status" value={state.status || ''} items={this.spriteAnimations}
                            onSelect={(item: string) => { this.changeValue('status', item) }} />

                        <div>
                            <CheckBoxInput label="Is player actor" value={state.isPlayer} inputHandler={value => { this.changeValue('isPlayer', value) }} />
                        </div>
                        <div>
                            <TextInput type="color" label="dialogue color" value={state.dialogueColor || ''} onInput={event => { this.changeValue('dialogueColor', eventToString(event)) }} />
                            <span>{state.dialogueColor}</span>
                        </div>
                        <div>
                            <NumberInput label="movement speed" value={state.speed || 1} inputHandler={value => { this.changeValue('speed', value) }} />
                        </div>
                        <div>
                            <CheckBoxInput label="Cannot interact with" value={state.noInteraction} inputHandler={value => { this.changeValue('noInteraction', value) }} />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Sprite</legend>

                        <ServiceItemSelector legend="choose sprite"
                            selectedItemId={spriteId}
                            format='select'
                            service={spriteService}
                            select={
                                item => this.setState({ sprite: item.id })
                            } />

                        <div>
                            <NumberInput label="width" value={width}
                                inputHandler={(value) => this.changeValue('width', value)} />
                            <NumberInput label="height" value={height}
                                inputHandler={(value) => this.changeValue('height', value)} />
                        </div>
                        <TextInput label="filter" value={state.filter || ''}
                            onInput={(event) => this.changeValue('filter', eventToString(event))} />

                        <SpritePreview data={this.previewData} />

                        <div>
                            <NumberInput label="display baseline" value={state.baseline || 0} min={0} max={state.height} inputHandler={value => { this.changeValue('baseline', value) }} />
                        </div>
                    </fieldset>

                    <StorageMenu
                        type="actorData"
                        data={this.currentData}
                        originalId={this.props.data?.id}
                        existingIds={actorIds}
                        reset={this.handleResetButton}
                        update={this.handleUpdateButton}
                        deleteItem={this.props.deleteData}
                        saveButton={true}
                        load={this.handleLoadButton}
                    />
                </div>
                <div className={styles.rowTopLeft}>

                    <fieldset>
                        <legend>Position</legend>
                        <div>
                            <SelectInput label="roomId"
                                emptyOptionLabel="[no room]"
                                items={listIds(this.props.rooms)}
                                value={state.room || ''}
                                haveEmptyOption={true}
                                onSelect={roomId => { this.changeValue('room', roomId) }} />
                        </div>
                        <SelectInput label="direction" value={state.direction || 'left'} items={directions}
                            onSelect={(item: string) => { this.changeValue('direction', item) }} />

                        <div>
                            <NumberInput label="x" value={state.x} inputHandler={value => { this.changeValue('x', value) }} />
                            <NumberInput label="y" value={state.y} inputHandler={value => { this.changeValue('y', value) }} />
                        </div>

                        <span>walk to point</span>
                        <div>
                            <OptionalNumberInput value={walkToX} label="X: " inputHandler={value => { this.changeValue('walkToX', value) }} />
                        </div>
                        <div>
                            <OptionalNumberInput value={walkToY} label="Y: " inputHandler={value => { this.changeValue('walkToY', value) }} />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Sounds</legend>
                        {soundEffectMap && (
                            <RecordEditor
                                record={soundEffectMap}
                                describeValue={(key, value) =>
                                    <SoundValueForm
                                        animation={key}
                                        data={value}
                                        updateData={(data) => { this.changeSoundMap(key, data) }}
                                    />
                                }
                                setEntry={(key, value) => { this.changeSoundMap(key, value) }}
                                addEntry={(key) => { this.changeSoundMap(key, newSound()) }}
                            />
                        )}
                    </fieldset>
                </div>

                <PositionPreview
                    actorData={this.state}
                    otherActors={this.otherActorsInRoom}
                    roomData={this.state.room ? findById(this.state.room, this.props.rooms) : undefined}
                    reportClick={this.handlePreviewClick}
                />

            </article>
        )
    }
}