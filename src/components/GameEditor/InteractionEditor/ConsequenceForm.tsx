import { SchemaForm, getModification } from "@/components/SchemaForm";
import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import { AnyConsequence, Consequence, GameDesign, Order } from "@/definitions";
import { Narrative } from "@/definitions/BaseTypes";
import { consequenceMap, consequenceTypes, immediateConsequenceTypes, zoneTypes } from "@/definitions/Consequence";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { cloneData } from "@/lib/clone";
import { findById, insertAt, listIds } from "@/lib/util";
import { Box } from "@mui/material";
import { ArrayControl } from "../ArrayControl";
import { EditorBox } from "../EditorBox";
import { NarrativeEditor } from "../NarrativeEditor";
import { OrderForm } from "../OrderForm";
import { OrderTypeButtons } from "../OrderTypeButtons";
import { SoundPreview } from "../SoundAssetTool/SoundPreview";
import { SpritePreview } from "../SpritePreview";
import { getDefaultOrder } from "../defaults";
import { ConsequenceFormRoom } from "./ConsequenceFormRoom";
import { getTargetLists, getZoneRefsOrIds } from "./getTargetLists";

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
    const { soundAssets, soundService } = useAssets()
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
        zoneType: zoneTypes,
        ref: getZoneRefsOrIds(gameDesign, consequence.roomId || '', consequence.zoneType),
        sound: soundAssets.map(_ => _.id),
        flag: Object.keys(gameDesign.flagMap),
        branchId: branchIdList,
        choiceRef: choiceRefList,
        storyBoardId: listIds(gameDesign.storyBoards)
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
    const needsSoundPreview = ['soundEffect'].includes(consequence.type)
    const soundAsset = consequence.sound ? soundService.get(consequence.sound) : undefined


    return (
        <Box display={'flex'}>
            <Box paddingY={2}>
                {/* doesn't use andy free text fields, but include delay incase schema changes */}
                <SchemaForm
                    textInputDelay={2000}
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
                        customCreateButton={index => (
                            <OrderTypeButtons
                                handler={(type) => () => {
                                    updateProperty('orders', insertAt(index, getDefaultOrder(type), consequence.orders ?? []))
                                }}
                            />
                        )}
                        mutateList={newList => { updateProperty('orders', newList) }}
                    />
                )}
                <NarrativeEditor narrative={consequence.narrative} update={updateNarrative} />
            </Box>

            {needsRoomPreview && <Box paddingY={2} paddingLeft={2}>
                <ConsequenceFormRoom update={update} consequence={consequence} />
            </Box>}
            {needsSoundPreview && <Box paddingY={2} paddingLeft={2}>
                <SoundPreview asset={soundAsset ?? {}} />
            </Box>}

            {actor && (
                <Box paddingY={2} paddingLeft={2}>
                    <SpritePreview data={actor} noBaseLine />
                </Box>
            )}
        </Box>
    )
}
