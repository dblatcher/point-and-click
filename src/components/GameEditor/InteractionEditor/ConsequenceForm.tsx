/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { consequenceTypes } from "../../../definitions/Interaction";
import { GameDesign,AnyConsequence,Order } from "src";
import { CheckBoxInput, NumberInput, SelectInput, TextInput } from "../formControls";
import { eventToString, listIds } from "../../../lib/util";
import { getTargetLists, getCharacterDescriptions, getItemDescriptions, getConversationsDescriptions, getSequenceDescriptions } from "./getTargetLists";
import { OrderForm } from "../OrderForm";
import { ListEditor } from "../ListEditor";
import { getDefaultOrder } from "../defaults";

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
        sequence: Object.keys(gameDesign.sequences),
    }
    const optionListDescriptions: { [index: string]: string[] | undefined } = {
        targetId: targetDescriptions,
        characterId: getCharacterDescriptions(gameDesign),
        itemId: getItemDescriptions(gameDesign),
        conversationId: getConversationsDescriptions(gameDesign),
        sequence: getSequenceDescriptions(gameDesign,)
    }

    const insertOrder = (index: number): void => {
        const ordersCopy = [...consequence.orders]
        ordersCopy.splice(index, 0, getDefaultOrder('talk'))
        edit('orders', ordersCopy)
    }
    const deleteOrder = (index: number): void => {
        const ordersCopy = [...consequence.orders]
        ordersCopy.splice(index, 1)
        edit('orders', ordersCopy)
    }
    const editOrder = (newOrder: Order, index: number): void => {
        const ordersCopy = [...consequence.orders]
        ordersCopy.splice(index, 1, newOrder)
        edit('orders', ordersCopy)
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
                case 'sequence':
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

                case 'orders': {
                    const orders = value as Order[]
                    return (
                        <div key={index}>
                            <ListEditor
                                list={orders}
                                describeItem={(order, index) =>
                                    <OrderForm
                                        updateData={(newOrder) => { editOrder(newOrder, index) }}
                                        data={order} key={index} />
                                }
                                deleteItem={deleteOrder}
                                insertItem={insertOrder}
                            />
                        </div>
                    )
                }
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
