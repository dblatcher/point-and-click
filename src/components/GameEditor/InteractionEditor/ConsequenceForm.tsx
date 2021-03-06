/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { AnyConsequence, consequenceTypes } from "../../../definitions/Interaction";
import { GameDesign } from "../../../definitions/Game";
import { CheckBoxInput, NumberInput, SelectInput, TextInput } from "../formControls";
import { eventToString, listIds } from "../../../lib/util";
import { Order } from "../../../definitions/Order";
import { getTargetLists, getCharacterDescriptions, getItemDescriptions } from "./getTargetLists";

interface Props {
    consequence: AnyConsequence;
    gameDesign: GameDesign;
    edit: { (property: keyof AnyConsequence, value: unknown): void };
}


export const ConsequenceForm: FunctionalComponent<Props> = ({ consequence, gameDesign, edit }: Props) => {

    const entries = Object.entries(consequence) as [keyof AnyConsequence, string | boolean | number | Order[]][]

    const { ids: targetIds, descriptions: targetDescriptions } = getTargetLists(gameDesign)

    const optionListIds = {
        type: consequenceTypes,
        conversationId: listIds(gameDesign.conversations),
        characterId: listIds(gameDesign.characters),
        itemId: listIds(gameDesign.items),
        roomId: listIds(gameDesign.rooms),
        targetId: targetIds,
        targetType: ['character', 'item', 'hotspot'],
        addOrRemove: ['ADD', 'REMOVE'],
    }
    const optionListDescriptions: { [index: string]: string[] | undefined } = {
        targetId: targetDescriptions,
        characterId: getCharacterDescriptions(gameDesign),
        itemId: getItemDescriptions(gameDesign),
    }

    return <div>

        {entries.map((entry, index) => {
            const [property, value] = entry

            switch (property) {
                case 'type':
                case 'conversationId':
                case 'characterId':
                case 'itemId':
                case 'roomId':
                case 'targetType':
                case 'addOrRemove':
                case 'targetId':
                    return (
                        <div key={index}>
                            <SelectInput value={value as string}
                                label={property}
                                items={optionListIds[property]}
                                descriptions={optionListDescriptions[property]}
                                onSelect={(value) => { edit(property, value) }}
                            />
                        </div>
                    )
                case 'sequence':
                case 'status':
                case 'text':
                    return (
                        <div key={index}>
                            <TextInput value={value as string}
                                label={property}
                                onInput={e => { edit(property, eventToString(e)) }}
                            />
                        </div>
                    )
                case 'end':
                case 'takePlayer':
                case 'replaceCurrentOrders':
                    return (
                        <div key={index}>
                            <CheckBoxInput
                                value={value as boolean}
                                label={property}
                                inputHandler={v => { edit(property, v) }}
                            />
                        </div>
                    )
                case 'x':
                case 'y':
                case 'time':
                    return (
                        <div key={index}>
                            <NumberInput
                                value={value as number}
                                label={property}
                                inputHandler={v => { edit(property, v) }}
                            />
                        </div>
                    )

                default:
                    return (
                        <div key={index}>
                            {property} NOT SUPPORTED
                        </div>
                    )
            }
        })}
    </div>

}
