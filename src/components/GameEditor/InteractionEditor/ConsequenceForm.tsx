/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionalComponent, h } from "preact";
import { consequenceTypes, immediateConsequenceTypes, ZoneType, zoneTypes } from "../../../definitions/Interaction";
import { GameDesign, AnyConsequence, Order, Consequence, ConsequenceType } from "src";
import { CheckBoxInput, NumberInput, SelectInput, StringInput } from "../formControls";
import { listIds } from "../../../lib/util";
import { getTargetLists, getActorDescriptions, getItemDescriptions, getConversationsDescriptions, getSequenceDescriptions, getZoneRefsOrIds } from "./getTargetLists";
import { OrderForm } from "../OrderForm";
import { ListEditor } from "../ListEditor";
import { getDefaultOrder } from "../defaults";
import { cloneData } from "../../../lib/clone";
import { makeNewConsequence } from "../defaults";
import soundService from "../../../services/soundService";

interface Props {
    consequence: AnyConsequence;
    gameDesign: GameDesign;
    update: { (consequence: Consequence): void }
    immediateOnly?: boolean
}


export const ConsequenceForm: FunctionalComponent<Props> = ({ consequence, gameDesign, update, immediateOnly }: Props) => {

    const entries = Object.entries(consequence) as [keyof AnyConsequence, string | boolean | number | Order[]][]

    const { ids: targetIds, descriptions: targetDescriptions } = getTargetLists(gameDesign)

    const optionListIds = {
        type: immediateOnly ? immediateConsequenceTypes : consequenceTypes,
        conversationId: listIds(gameDesign.conversations),
        actorId: listIds(gameDesign.actors),
        itemId: listIds(gameDesign.items),
        roomId: listIds(gameDesign.rooms),
        targetId: targetIds,
        targetType: ['actor', 'item', 'hotspot'],
        addOrRemove: ['ADD', 'REMOVE'],
        sequence: listIds(gameDesign.sequences),
        endingId: listIds(gameDesign.endings),
        zoneType: zoneTypes,
        ref: getZoneRefsOrIds(gameDesign, consequence.roomId || '', consequence.zoneType),
        sound: soundService.getAll().map(_=>_.id),
    }
    const optionListDescriptions: { [index: string]: string[] | undefined } = {
        targetId: targetDescriptions,
        actorId: getActorDescriptions(gameDesign),
        itemId: getItemDescriptions(gameDesign),
        conversationId: getConversationsDescriptions(gameDesign),
        sequence: getSequenceDescriptions(gameDesign)
    }
    const editOrder = (newOrder: Order, index: number): void => {
        const ordersCopy = [...consequence.orders]
        ordersCopy.splice(index, 1, newOrder)
        updateProperty('orders', ordersCopy)
    }

    const updateProperty = (property: keyof AnyConsequence, value: unknown): void => {
        const copy = cloneData(consequence)
        switch (property) {
            case 'type': {
                if (consequenceTypes.includes(value as ConsequenceType)) {
                    update(makeNewConsequence(value as ConsequenceType))
                }
                return;
            }
            case 'zoneType': {
                if (zoneTypes.includes(value as ZoneType)) {
                    copy[property] = value as ZoneType
                }
                break;
            }
            case 'conversationId':
            case 'sequence':
            case 'targetId':
            case 'status':
            case 'actorId':
            case 'itemId':
            case 'roomId':
            case 'endingId':
            case 'text':
            case 'addOrRemove':
            case 'ref':
            case 'targetType':
            case 'sound': {
                copy[property] = value as string
                break;
            }
            case 'end':
            case 'takePlayer':
            case 'on':
            case 'replaceCurrentOrders': {
                copy[property] = value as boolean
                break;
            }
            case 'time':
            case 'volume':
            case 'x':
            case 'y':
                copy[property] = value as number
                break;
            case 'orders':
                copy[property] = value as Order[]
        }
        update(copy)
    }

    return <div>

        {entries.map((entry, index) => {
            const [property, value] = entry

            switch (property) {
                case 'type':
                case 'conversationId':
                case 'actorId':
                case 'itemId':
                case 'roomId':
                case 'targetType':
                case 'addOrRemove':
                case 'targetId':
                case 'endingId':
                case 'sequence':
                case 'zoneType':
                case 'ref':
                case 'sound':
                    return (
                        <div key={index}>
                            <SelectInput value={value as string}
                                label={property === 'type' ? 'consequence type' : property}
                                items={optionListIds[property]}
                                descriptions={optionListDescriptions[property]}
                                onSelect={(value) => { updateProperty(property, value) }}
                            />
                        </div>
                    )
                case 'status':
                case 'text':
                    return (
                        <div key={index}>
                            <StringInput value={value as string}
                                type={property === 'text' ? 'textArea' : undefined}
                                label={property}
                                inputHandler={value => { updateProperty(property, value) }}
                            />
                        </div>
                    )
                case 'end':
                case 'takePlayer':
                case 'replaceCurrentOrders':
                case 'on':
                    return (
                        <div key={index}>
                            <CheckBoxInput
                                value={value as boolean}
                                label={property}
                                inputHandler={v => { updateProperty(property, v) }}
                            />
                        </div>
                    )
                case 'x':
                case 'y':
                case 'time':
                case 'volume':
                    return (
                        <div key={index}>
                            <NumberInput
                                value={value as number}
                                label={property}
                                inputHandler={v => { updateProperty(property, v) }}
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
                                createItem={() => getDefaultOrder('talk')}
                                mutateList={newList => { updateProperty('orders', newList) }}
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
