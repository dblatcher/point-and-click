/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { Consequence, consequenceTypes } from "../../../definitions/Interaction";
import { GameCondition } from "../../../definitions/Game";
import { CheckBoxInput, SelectInput, TextInput } from "../formControls";
import { eventToString, listIds } from "../../../lib/util";

interface Props {
    consequence: Consequence;
    gameDesign: Omit<GameCondition, 'characterOrders' | 'sequenceRunning'>;
    edit: { (property: string, value: unknown): void };
}


export const ConsequenceForm: FunctionalComponent<Props> = ({ consequence, gameDesign, edit }: Props) => {

    const entries = Object.entries(consequence)

    const optionLists = {
        type: consequenceTypes,
        conversationId: listIds(gameDesign.conversations),
        characterId: listIds(gameDesign.characters),
        itemId: listIds(gameDesign.items),
        roomId: listIds(gameDesign.rooms),
        targetType: ['character', 'item', 'hotspot'],
        addOrRemove: ['ADD', 'REMOVE'],
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
                    return (
                        <div key={index}>
                            <SelectInput value={(consequence as unknown as Record<string, string>)[property]}
                                label={property}
                                items={optionLists[property]}
                                onSelect={(value) => { edit(property, value) }}
                            />
                        </div>
                    )
                case 'sequence':
                case 'targetId':
                case 'status':
                case 'text':
                    return (
                        <div key={index}>
                            <TextInput value={value}
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
                                value={value}
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
