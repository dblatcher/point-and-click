/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, h } from "preact";
import { eventToNumber, eventToString } from "../../lib/util";
import { Ident } from "../../definitions/BaseTypes";
import { CharacterData } from "../../definitions/CharacterData";
import { IdentInput, NumberInput } from "../formControls";
import { ServiceItemSelector } from "../ServiceItemSelector";
import spriteService from "../../services/spriteService";


type ExtraState = {

}

type State = Partial<CharacterData> & Ident & ExtraState;

type Props = {
    data?: CharacterData;
}

const makeBlankCharacter = (): Partial<CharacterData> & Ident => ({
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
                if (typeof newValue === 'string') {
                    modification[propery] = newValue
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

    render() {
        const { sprite: spriteId, width = 1, height = 1 } = this.state

        return (
            <article>
                <h2>Character Editor</h2>

                <fieldset>
                    <legend>Ident</legend>
                    <IdentInput showType value={this.state}
                        onChangeId={(event) => this.changeValue('id', eventToString(event))}
                        onChangeName={(event) => this.changeValue('name', eventToString(event))}
                        onChangeStatus={(event) => this.changeValue('status', eventToString(event))}
                    />
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

                    <NumberInput label="width" value={width}
                        onInput={(event) => this.changeValue('width', eventToNumber(event))} />
                    <NumberInput label="height" value={height}
                        onInput={(event) => this.changeValue('height', eventToNumber(event))} />
                </fieldset>

            </article>
        )
    }
}