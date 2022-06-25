/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { eventToNumber, eventToString } from "../../lib/util";
import { Ident } from "../../definitions/BaseTypes";
import { CharacterData } from "../../definitions/CharacterData";
import { IdentInput, NumberInput, SelectInput, TextInput } from "../formControls";
import { ServiceItemSelector } from "../ServiceItemSelector";
import spriteService from "../../services/spriteService";
import { Direction, directions } from "../../definitions/SpriteSheet";
import { SpritePreview } from "../SpriteEditor/SpritePreview";


type ExtraState = {

}

type State = CharacterData & { sprite: string | undefined } & ExtraState;

type Props = {
    data?: CharacterData;
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
    }

    changeValue(propery: keyof CharacterData, newValue: string | number) {
        const modification: Partial<State> = {}
        switch (propery) {
            case 'id':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue.toUpperCase()
                }
                break;
            case 'name':
            case 'status':
            case 'filter':
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
                if (typeof newValue === 'number') {
                    modification[propery] = newValue
                }
                break;
        }
        this.setState(modification)
    }

    get previewData(): CharacterData {
        return {
            ...this.state,
            x: this.state.width/2, y: 0
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

                    <SelectInput label="direction" value={state.direction || 'left'} items={directions}
                        onSelect={(item: string) => { this.changeValue('direction', item) }} />
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
                            onInput={(event) => this.changeValue('width', eventToNumber(event))} />
                        <NumberInput label="height" value={height}
                            onInput={(event) => this.changeValue('height', eventToNumber(event))} />
                    </div>



                    <TextInput label="filter" value={state.filter || ''}
                        onInput={(event) => this.changeValue('filter', eventToString(event))} />

                    <SpritePreview data={this.previewData} />
                </fieldset>

            </article>
        )
    }
}