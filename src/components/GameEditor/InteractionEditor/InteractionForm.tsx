/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h, Fragment } from "preact";
import { useState } from "preact/hooks";
import { cloneData } from "../../../lib/clone";
import { InteractionSchema } from "../../../definitions/Interaction";
import { GameDesign, Interaction, ConsequenceType, AnyConsequence, Order } from "src";
import { SelectInput, TextInput } from "../formControls";
import { eventToString, listIds } from "../../../lib/util";
import { ListEditor } from "../ListEditor";
import { ConsequenceForm } from "./ConsequenceForm";
import { makeNewConsequence } from "./makeNewConsequence";
import { getItemDescriptions, getTargetLists } from "./getTargetLists";

interface Props {
    initialState: Partial<Interaction>;
    gameDesign: GameDesign;
    confirm: { (interaction: Interaction): void };
}


export const InteractionForm: FunctionalComponent<Props> = ({ initialState, gameDesign, confirm }: Props) => {

    const [interaction, setInteraction] = useState<Partial<Interaction>>(Object.assign({ consequences: [] }, cloneData(initialState)))
    const { ids: targetIds, descriptions: targetDescriptions } = getTargetLists(gameDesign)

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
    const editConsequence = (index: number, property: keyof AnyConsequence, value: unknown) => {
        const { consequences = [] } = interaction
        if (property === 'type' && typeof value === 'string') {
            consequences.splice(index, 1, makeNewConsequence(value as ConsequenceType))
        } else {
            const consequence = consequences[index] as AnyConsequence;
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
                    consequence[property] = value as string
                    break;
                }
                case 'end':
                case 'takePlayer':
                case 'replaceCurrentOrders': {
                    consequence[property] = value as boolean
                    break;
                }
                case 'time':
                case 'x':
                case 'y':
                    consequence[property] = value as number
                    break;
                case 'orders':
                    consequence[property] = value as Order[]
            }
            consequences.splice(index, 1, consequence)
        }

        setInteraction(Object.assign({}, interaction, { consequences }))
    }

    const handleConfirm = () => {
        const result = InteractionSchema.safeParse(interaction)
        if (result.success) {
            confirm(result.data)
        }
    }

    const handleReset = () => {
        setInteraction(Object.assign({ consequences: [] }, cloneData(initialState)))
    }

    const verb = gameDesign.verbs.find(_ => _.id === interaction.verbId);
    const showItemOption = verb?.preposition
    const { consequences = [] } = interaction
    const parseResult = InteractionSchema.safeParse(interaction)

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
                        items={listIds(gameDesign.items)} descriptions={getItemDescriptions(gameDesign)} />
                    <span> {verb?.preposition} </span>
                </>}

                <SelectInput
                    haveEmptyOption={true}
                    onSelect={(targetId: string) => { setInteractionProperty('targetId', targetId) }}
                    emptyOptionLabel="(choose target)"
                    value={interaction.targetId || ''}
                    items={targetIds}
                    descriptions={targetDescriptions} />
            </fieldset>

            <fieldset>
                <legend>conditions</legend>
                <div>
                    <SelectInput
                        label="Must be in"
                        haveEmptyOption={true}
                        onSelect={(roomId: string) => { setInteractionProperty('roomId', roomId) }}
                        emptyOptionLabel="(choose room)"
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
                            consequence={consequence as AnyConsequence}
                            edit={(property, value) => { editConsequence(index, property, value) }}
                            gameDesign={gameDesign} />
                    )}
                    mutateList={newConsequences => {
                        interaction.consequences = newConsequences
                        setInteraction(Object.assign({}, interaction))
                    }}
                    createItem={() => makeNewConsequence('order')}
                />

            </fieldset>
            <div>
                <button
                    onClick={handleConfirm}
                    disabled={!parseResult.success}
                    title={(!parseResult.success && parseResult.error.message) || ''}
                >SAVE CHANGES</button>
            </div>
            <div>
                <button onClick={handleReset}>RESET CHANGES</button>
            </div>
        </article>
    )
}