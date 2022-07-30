/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { CharacterData, Direction } from "src";
import { CharacterDataSchema } from "../../../definitions/CharacterData";
import { directions } from "../../../definitions/SpriteSheet";
import { CheckBoxInput, IdentInput, NumberInput, SelectInput, TextInput } from "../formControls";
import { ServiceItemSelector } from "../ServiceItemSelector";
import spriteService from "../../../services/spriteService";
import { SpritePreview } from "../SpritePreview";
import { StorageMenu } from "../StorageMenu";
import { cloneData } from "../../../lib/clone";
import { eventToString } from "../../../lib/util";
import { uploadJsonData } from "../../../lib/files";


type ExtraState = {

}

type State = CharacterData & { sprite: string | undefined } & ExtraState;

type Props = {
    data?: CharacterData;
    updateData?: { (data: CharacterData): void };
    roomIds: string[];
    characterIds: string[];
}

const makeBlankCharacter = (): CharacterData => ({
    id: 'NEW_CHARACTER',
    type: 'character',
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

export class CharacterEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)

        const initialState = props.data ? {
            ...props.data
        } : makeBlankCharacter()

        this.state = {
            ...initialState
        }

        this.handleLoadButton = this.handleLoadButton.bind(this)
        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
    }

    get currentData(): CharacterData {
        const characterData = cloneData(this.state) as State;
        return characterData
    }

    changeValue(propery: keyof CharacterData, newValue: string | number | boolean) {
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
                if (typeof newValue === 'number') {
                    modification[propery] = newValue
                }
                break;
            case 'isPlayer':
                if (typeof newValue === 'boolean') {
                    modification[propery] = newValue
                }
                break;
        }
        this.setState(modification)
    }
    handleLoadButton = async () => {
        const { data, error } = await uploadJsonData(CharacterDataSchema)
        if (data) {
            this.setState(data)
        } else {
            console.warn("NOT CHARACTER DATA", error)
        }
    }
    handleResetButton() {
        const { props } = this
        const initialState = props.data ? cloneData(props.data) : makeBlankCharacter()
        this.setState({
            ...initialState
        })
    }
    handleUpdateButton() {
        if (this.props.updateData) {
            this.props.updateData(this.currentData)
        }
    }


    get previewData(): CharacterData {
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

    render() {
        const { state } = this
        const { sprite: spriteId, width = 1, height = 1, } = state
        const { characterIds } = this.props

        return (
            <article>
                <h2>Character Editor</h2>

                <fieldset>
                    <legend>Ident</legend>
                    <IdentInput showType value={state}
                        onChangeId={(event) => this.changeValue('id', eventToString(event))}
                        onChangeName={(event) => this.changeValue('name', eventToString(event))}
                        onChangeStatus={(event) => this.changeValue('status', eventToString(event))}
                    />

                    <SelectInput label="status" value={state.status || ''} items={this.spriteAnimations}
                        onSelect={(item: string) => { this.changeValue('status', item) }} />

                </fieldset>

                <StorageMenu
                    type="characterData"
                    data={this.currentData}
                    originalId={this.props.data?.id}
                    existingIds={characterIds}
                    reset={this.handleResetButton}
                    update={this.handleUpdateButton}
                    saveButton={true}
                    load={this.handleLoadButton}
                />
                <fieldset>
                    <legend>Character details</legend>
                    <div>
                        <NumberInput label="movement speed" value={state.speed || 1} inputHandler={value => { this.changeValue('speed', value) }} />
                    </div>
                    <div>
                        <CheckBoxInput label="Is player character" value={state.isPlayer} inputHandler={value => { this.changeValue('isPlayer', value) }} />
                    </div>
                    <div>
                        <TextInput type="color" label="dialogue color" value={state.dialogueColor || ''} onInput={event => { this.changeValue('dialogueColor', eventToString(event)) }} />
                        <span>{state.dialogueColor}</span>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Disposition</legend>
                    <SelectInput label="direction" value={state.direction || 'left'} items={directions}
                        onSelect={(item: string) => { this.changeValue('direction', item) }} />

                    <div>
                        <NumberInput label="x" value={state.x} inputHandler={value => { this.changeValue('x', value) }} />
                        <NumberInput label="y" value={state.y} inputHandler={value => { this.changeValue('y', value) }} />
                    </div>
                    <div>
                        <SelectInput label="roomId"
                            emptyOptionLabel="[no room]"
                            items={this.props.roomIds}
                            value={state.room || ''}
                            haveEmptyOption={true}
                            onSelect={roomId => { this.changeValue('room', roomId) }} />
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
                </fieldset>

            </article>
        )
    }
}