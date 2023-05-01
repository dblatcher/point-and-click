import { FunctionComponent } from "react";
import { consequenceMap, consequenceTypes, immediateConsequenceTypes, zoneTypes } from "@/oldsrc/definitions/Consequence";
import { GameDesign, AnyConsequence, Order, Consequence, ConsequenceType } from "@/oldsrc";
import { SelectInput } from "../formControls";
import { findById, listIds } from "@/lib/util";
import { getTargetLists, getActorDescriptions, getItemDescriptions, getConversationsDescriptions, getSequenceDescriptions, getZoneRefsOrIds } from "./getTargetLists";
import { OrderForm } from "../OrderForm";
import { ListEditor } from "../ListEditor";
import { getDefaultOrder, makeNewConsequence } from "../defaults";
import { cloneData } from "@/lib/clone";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import soundService from "@/services/soundService";
import { getModification, SchemaForm } from "../SchemaForm";
import editorStyles from '../editorStyles.module.css';

interface Props {
    consequence: AnyConsequence;
    gameDesign: GameDesign;
    update: { (consequence: Consequence): void };
    immediateOnly?: boolean;
}


const getBranchIdAndChoiceRefOptions = (conversationId: string | undefined, branchId: string | undefined, gameDesign: GameDesign) => {

    const conversation = findById(conversationId, gameDesign.conversations)
    const branch = conversation && branchId ? conversation.branches[branchId] : undefined;
    const branchIdList = Object.keys(conversation?.branches || {})
    const choiceRefList: string[] = branch
        ? branch.choices.map(choice => choice.ref).filter(ref => typeof ref === 'string') as string[]
        : []

    return { branchIdList, choiceRefList }
}

export const ConsequenceForm: FunctionComponent<Props> = ({ consequence, gameDesign, update, immediateOnly }: Props) => {
    const { ids: targetIds, descriptions: targetDescriptions } = getTargetLists(gameDesign)
    const { ids: targetIdsWithoutItems, descriptions: targetDescriptionsWithoutItems } = getTargetLists(gameDesign, true)

    const { branchIdList, choiceRefList } = getBranchIdAndChoiceRefOptions(consequence.conversationId, consequence.branchId, gameDesign)
    const optionListIds = {
        type: immediateOnly ? immediateConsequenceTypes : consequenceTypes,
        conversationId: listIds(gameDesign.conversations),
        actorId: listIds(gameDesign.actors),
        itemId: listIds(gameDesign.items),
        roomId: listIds(gameDesign.rooms),
        targetType: ['actor', 'item', 'hotspot'],
        addOrRemove: ['ADD', 'REMOVE'],
        sequence: listIds(gameDesign.sequences),
        endingId: listIds(gameDesign.endings),
        zoneType: zoneTypes,
        ref: getZoneRefsOrIds(gameDesign, consequence.roomId || '', consequence.zoneType),
        sound: soundService.getAll().map(_ => _.id),
        flag: Object.keys(gameDesign.flagMap),
        branchId: branchIdList,
        choiceRef: choiceRefList,
    }
    const optionListDescriptions: { [index: string]: string[] | undefined } = {
        targetId: targetDescriptions,
        actorId: getActorDescriptions(gameDesign),
        itemId: getItemDescriptions(gameDesign),
        conversationId: getConversationsDescriptions(gameDesign),
        sequence: getSequenceDescriptions(gameDesign)
    }

    // for properties not handled by the Schema form
    const updateProperty = (property: 'orders', value: unknown): void => {
        const copy = cloneData(consequence)
        switch (property) {
            case 'orders':
                copy[property] = value as Order[]
        }
        update(copy)
    }

    const changeType = (value: string): void => {
        if (consequenceTypes.includes(value as ConsequenceType)) {
            update(makeNewConsequence(value as ConsequenceType))
        }
    }

    const editOrder = (newOrder: Order, index: number): void => {
        const ordersCopy = [...(consequence.orders || [])]
        ordersCopy.splice(index, 1, newOrder)
        updateProperty('orders', ordersCopy)
    }

    return <div className={editorStyles.formBlock}>

        <SelectInput value={consequence.type}
            block
            className={editorStyles.formRow}
            label={'type'}
            items={optionListIds.type}
            descriptions={optionListDescriptions.type}
            onSelect={changeType}
        />

        <SchemaForm
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            schema={consequenceMap[consequence.type] as any}
            numberConfig={{
                time: { min: 0 },
                volume: {
                    step: .1,
                    max: 2,
                    min: 0,
                }
            }}
            options={optionListIds}
            suggestions={{
                targetId: targetIds,
                status: getStatusSuggestions(consequence.targetId, gameDesign)
            }}
            data={consequence}
            changeValue={(value, field) => {
                update({
                    ...consequence,
                    ...getModification(value, field)
                })
            }}
        />
        {consequence.orders && (<fieldset>
            <legend style={{ fontWeight: 'bold' }}>orders</legend>
            <ListEditor
                list={consequence.orders}
                describeItem={(order, index) =>
                    <OrderForm
                        animationSuggestions={getStatusSuggestions(consequence.actorId, gameDesign)}
                        targetIdOptions={targetIdsWithoutItems}
                        targetIdDescriptions={targetDescriptionsWithoutItems}
                        updateData={(newOrder) => { editOrder(newOrder, index) }}
                        data={order} key={index} />
                }
                createItem={() => getDefaultOrder('say')}
                mutateList={newList => { updateProperty('orders', newList) }}
            />
        </fieldset>)}
    </div>
}
