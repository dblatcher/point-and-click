import { SchemaForm, getModification } from "@/components/SchemaForm";
import { SelectInput } from "@/components/SchemaForm/inputs";
import { useGameDesign } from "@/context/game-design-context";
import { AnyConsequence, Consequence, ConsequenceType, GameDesign, Order, RoomData, Zone } from "@/definitions";
import { Narrative } from "@/definitions/BaseTypes";
import { consequenceMap, consequenceTypes, immediateConsequenceTypes, zoneTypes } from "@/definitions/Consequence";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { cloneData } from "@/lib/clone";
import { findById, listIds } from "@/lib/util";
import soundService from "@/services/soundService";
import { Box } from "@mui/material";
import { ArrayControl } from "../ArrayControl";
import { EditorBox } from "../EditorBox";
import { NarrativeEditor } from "../NarrativeEditor";
import { OrderForm } from "../OrderForm";
import { SpritePreview } from "../SpritePreview";
import { getDefaultOrder, makeNewConsequence } from "../defaults";
import { ConsequenceFormRoom } from "./ConsequenceFormRoom";
import { getActorDescriptions, getConversationsDescriptions, getItemDescriptions, getSequenceDescriptions, getTargetLists, getZoneRefsOrIds } from "./getTargetLists";

interface Props {
    consequence: AnyConsequence;
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

export const ConsequenceForm = ({ consequence, update, immediateOnly }: Props) => {
    const { gameDesign } = useGameDesign()
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

    const changeType = (value: string | undefined): void => {
        if (consequenceTypes.includes(value as ConsequenceType)) {
            update(makeNewConsequence(value as ConsequenceType))
        }
    }

    const editOrder = (newOrder: Order, index: number): void => {
        const ordersCopy = [...(consequence.orders || [])]
        ordersCopy.splice(index, 1, newOrder)
        updateProperty('orders', ordersCopy)
    }

    const updateNarrative = (newNarrative: Narrative | undefined) => {
        update({ ...consequence, narrative: newNarrative })
    }

    const actor = findById(consequence.actorId, gameDesign.actors)

    const needsRoomPreview = ['changeRoom', 'teleportActor', 'toggleZone'].includes(consequence.type)

    return (
        <Box display={'flex'}>
            <Box paddingY={2}>
                <Box marginBottom={2}>
                    <SelectInput value={consequence.type}
                        label={'type'}
                        options={optionListIds.type}
                        descriptions={optionListDescriptions.type}
                        inputHandler={changeType}
                    />
                </Box>

                <SchemaForm
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
                {consequence.orders && (
                    <ArrayControl color="secondary"
                        list={consequence.orders}
                        describeItem={(order, index) =>
                            <EditorBox title={`${order.type} order`} themePalette="secondary">
                                <OrderForm
                                    animationSuggestions={getStatusSuggestions(consequence.actorId, gameDesign)}
                                    targetIdOptions={targetIdsWithoutItems}
                                    targetIdDescriptions={targetDescriptionsWithoutItems}
                                    updateData={(newOrder) => { editOrder(newOrder, index) }}
                                    data={order} key={index} />
                            </EditorBox>
                        }
                        createItem={() => getDefaultOrder('say')}
                        mutateList={newList => { updateProperty('orders', newList) }}
                    />
                )}
                <NarrativeEditor narrative={consequence.narrative} update={updateNarrative} />
            </Box>

            {needsRoomPreview && <Box paddingY={2} paddingLeft={2}>
                <ConsequenceFormRoom update={update} consequence={consequence} />
            </Box>}

            {actor && (
                <Box paddingY={2} paddingLeft={2}>
                    <SpritePreview data={actor} noBaseLine />
                </Box>
            )}
        </Box>
    )
}
