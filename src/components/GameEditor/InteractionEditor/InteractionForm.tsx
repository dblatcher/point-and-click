/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h, Fragment } from "preact";
import { useState } from "preact/hooks";
import { cloneData } from "../../../lib/clone";
import { Consequence, Interaction, ConsequenceType } from "../../../definitions/Interaction";
import { GameCondition } from "../../../definitions/Game";
import { SelectInput, TextInput } from "../formControls";
import { eventToString, listIds } from "../../../lib/util";
import { ListEditor } from "../ListEditor";
import { ConsequenceForm } from "./ConsequenceForm";

interface Props {
    initialState: Partial<Interaction>;
    gameDesign: Omit<GameCondition, 'characterOrders' | 'sequenceRunning'>;
}


function makeNewConsequence(type: ConsequenceType): Consequence {
    switch (type) {
        case 'conversation':
            return { type: 'conversation', conversationId: '' }
        case 'sequence':
            return { type: 'sequence', sequence: '' }
        case 'changeStatus':
            return { type: 'changeStatus', targetId: '', status: '', targetType: 'character' }
        case 'removeCharacter':
            return { type: 'removeCharacter', characterId: '' }
        case 'inventory':
            return { type: "inventory", itemId: '', addOrRemove: 'ADD' }
        case 'changeRoom':
            return { type: 'changeRoom', roomId: '', takePlayer: true }
        case 'talk':
            return { type: 'talk', text: '', characterId: '', time: 100 }
        case 'order':
        default:
            return { type: 'order', orders: [] }
    }
}

export const InteractionForm: FunctionalComponent<Props> = ({ initialState, gameDesign }: Props) => {

    const [interaction, setInteraction] = useState(cloneData(initialState))

    const setInteractionProperty = (property: keyof Interaction, value: unknown) => {
        const modification: Partial<Interaction> = {}
        switch (property) {
            case 'verbId':
            case 'targetId':
            case 'targetStatus':
            case 'itemId':
            case 'roomId':
                {
                    modification[property] = value as string;
                }
        }
        setInteraction(Object.assign({}, interaction, modification))
    }
    const deleteConsequence = (index: number) => {
        const { consequences = [] } = interaction
        consequences.splice(index, 1)
        interaction.consequences = consequences
        setInteraction(Object.assign({}, interaction))
    }
    const addConsequence = (index: number) => {
        const { consequences = [] } = interaction
        consequences.splice(index, 0, makeNewConsequence('talk'))
        interaction.consequences = consequences
        setInteraction(Object.assign({}, interaction))
    }
    const editConsequence = (index: number, property: string, value: unknown) => {
        const { consequences = [] } = interaction

        if (property === 'type' && typeof value === 'string') {
            consequences.splice(index, 1, makeNewConsequence(value as ConsequenceType))
        } else {
            switch (property) {
                case 'conversationId':
                case 'sequence':
                case 'targetId':
                case 'status':
                case 'characterId':
                case 'itemId':
                case 'roomId':
                case 'text':
                case 'addOrRemove':
                case 'targetType': {
                    const consequence = consequences[index] as Consequence & {
                        conversationId: string;
                        sequence: string;
                        targetId: string;
                        itemId: string;
                        status: string;
                        characterId: string;
                        roomId: string;
                        text: string;
                        targetType: string;
                        addOrRemove: string;
                    };
                    consequence[property] = value as string
                    consequences.splice(index, 1, consequence)
                    break;
                }
                case 'end':
                case 'takePlayer':
                case 'replaceCurrentOrders': {
                    const consequence = consequences[index] as Consequence & {
                        end: boolean;
                        takePlayer: boolean;
                        replaceCurrentOrders: boolean;
                    };
                    consequence[property] = value as boolean
                    consequences.splice(index, 1, consequence)
                    break;
                }
            }
        }

        setInteraction(Object.assign({}, interaction, { consequences }))
    }

    const verb = gameDesign.verbs.find(_ => _.id === interaction.verbId);
    const showItemOption = verb?.preposition
    const { consequences = [] } = interaction

    return (
        <article>
            <fieldset>
                <legend>command</legend>
                <SelectInput
                    haveEmptyOption={true}
                    onSelect={(verbId: string) => { setInteractionProperty('verbId', verbId) }}
                    emptyOptionLabel="(choose verb)"
                    value={interaction.verbId || ''}
                    items={listIds(gameDesign.verbs)} />

                {showItemOption && <>
                    <SelectInput
                        haveEmptyOption={true}
                        onSelect={(itemId: string) => { setInteractionProperty('itemId', itemId) }}
                        emptyOptionLabel="(choose item)"
                        value={interaction.itemId || ''}
                        items={listIds(gameDesign.items)} />
                    <span> {verb?.preposition} </span>
                </>}

                <SelectInput
                    haveEmptyOption={true}
                    onSelect={(targetId: string) => { setInteractionProperty('targetId', targetId) }}
                    emptyOptionLabel="(choose target)"
                    value={interaction.targetId || ''}
                    items={[...listIds(gameDesign.items), ...listIds(gameDesign.characters)]} />
                {/* TO DO get the target list? */}
            </fieldset>

            <fieldset>
                <legend>conditions</legend>
                <div>
                    <SelectInput
                        label="Must be in"
                        haveEmptyOption={true}
                        onSelect={(roomId: string) => { setInteractionProperty('roomId', roomId) }}
                        emptyOptionLabel="(choose item)"
                        value={interaction.roomId || ''}
                        items={listIds(gameDesign.rooms)} />
                </div>
                <div>
                    <TextInput
                        label="Target status must be"
                        onInput={(event) => { setInteractionProperty('targetStatus', eventToString(event)) }}
                        value={interaction.targetStatus || ''}
                    />
                </div>
            </fieldset>

            <fieldset>
                <legend>consequences</legend>

                <ListEditor
                    list={consequences}
                    describeItem={(consequence, index) => (
                        <ConsequenceForm
                            consequence={consequence}
                            edit={(property, value) => { editConsequence(index, property, value) }}
                            gameDesign={gameDesign} />
                    )}
                    deleteItem={deleteConsequence}
                    insertItem={addConsequence}
                />

            </fieldset>
        </article>
    )
}