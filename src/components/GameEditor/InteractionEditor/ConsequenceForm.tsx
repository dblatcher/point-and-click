import { SchemaForm } from "@/components/SchemaForm";
import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { findById, insertAt, listIds } from "@/lib/util";
import { Box } from "@mui/material";
import { AnyConsequence, Consequence, consequenceMap, consequenceTypes, GameDesign, immediateConsequenceTypes, Order, zoneTypes } from "point-click-lib";
import { useState } from "react";
import { ZodObject } from "zod";
import { ArrayControl } from "../ArrayControl";
import { OrderTypeButtons } from "../OrderTypeButtons";
import { OrderCard } from "../SequenceEditor/OrderCard";
import { OrderDialog } from "../SequenceEditor/OrderDialog";
import { SoundPreview } from "../SoundAssetTool/SoundPreview";
import { SpritePreview } from "../SpritePreview";
import { getDefaultOrder, makeBlankConversation, makeBlankSequence, makeEmptyStoryBoard } from "../defaults";
import { AddItemButton } from "../game-item-components/AddItemButton";
import { ConsequenceFormRoom } from "./ConsequenceFormRoom";
import { getTargetLists, getZoneRefsOrIds } from "./getTargetLists";

interface Props {
    consequence: Consequence;
    update: { (consequence: Consequence): void };
}


const getBranchIdAndChoiceRefOptions = (consequence: Consequence, gameDesign: GameDesign) => {
    const conversationId = consequence.type === 'conversation' || consequence.type === 'conversationChoice' ? consequence.conversationId : undefined;
    const branchId = consequence.type === 'conversationChoice' ? consequence.branchId : undefined;

    const conversation = findById(conversationId, gameDesign.conversations)
    const branch = conversation && branchId ? conversation.branches[branchId] : undefined;
    const branchIdList = Object.keys(conversation?.branches || {})
    const choiceRefList: string[] = branch
        ? branch.choices.map(choice => choice.ref).filter(ref => typeof ref === 'string') as string[]
        : []

    return { branchIdList, choiceRefList }
}

export const ConsequenceForm = ({ consequence, update }: Props) => {
    const { roomId, zoneType, actorId, sound, targetId } = consequence as AnyConsequence;
    const { gameDesign, dispatchDesignUpdate } = useGameDesign()
    const { soundAssets, soundService } = useAssets()
    const [orderIndexDialog, setDialogOrderIndex] = useState<number>()
    const { ids: targetIds } = getTargetLists(gameDesign)

    const { branchIdList, choiceRefList } = getBranchIdAndChoiceRefOptions(consequence, gameDesign)
    const optionListIds = {
        conversationId: listIds(gameDesign.conversations),
        actorId: listIds(gameDesign.actors),
        itemId: listIds(gameDesign.items),
        roomId: listIds(gameDesign.rooms),
        targetType: ['actor', 'item', 'hotspot'],
        addOrRemove: ['ADD', 'REMOVE'],
        sequence: listIds(gameDesign.sequences),
        zoneType: zoneTypes,
        ref: getZoneRefsOrIds(gameDesign, roomId, zoneType),
        sound: soundAssets.map(_ => _.id),
        flag: Object.keys(gameDesign.flagMap),
        branchId: branchIdList,
        choiceRef: choiceRefList,
        storyBoardId: listIds(gameDesign.storyBoards)
    }

    const updateOrders = (orders: Order[]): void => {
        if (consequence.type !== 'order') {
            return
        }
        update({
            ...consequence,
            orders: orders
        })
    }

    const editOrder = (newOrder: Order, index: number): void => {
        if (consequence.type !== 'order') {
            return
        }
        const ordersCopy = [...consequence.orders]
        ordersCopy.splice(index, 1, newOrder)
        updateOrders(ordersCopy)
    }

    const actor = findById(actorId, gameDesign.actors)
    const needsRoomPreview = ['changeRoom', 'teleportActor', 'toggleZone'].includes(consequence.type)
    const needsSoundPreview = ['soundEffect', 'backgroundMusic', 'ambientNoise'].includes(consequence.type)
    const soundAsset = sound ? soundService.get(sound) : undefined

    return (
        <Box display={'flex'} paddingY={2} gap={2}>
            <Box flexBasis={200}>
                <SchemaForm
                    schema={(consequenceMap[consequence.type] as unknown as ZodObject<any>).omit({
                        type: true,
                        narrative: true,
                        orders: true,
                    })}
                    numberConfig={{
                        volume: {
                            step: .1,
                            max: 2,
                            min: 0,
                        }
                    }}
                    options={optionListIds}
                    suggestions={{
                        targetId: targetIds,
                        status: getStatusSuggestions(targetId, gameDesign)
                    }}
                    data={consequence}
                    changeValue={mod => {
                        const parsed = consequenceMap[consequence.type].safeParse({
                            ...consequence,
                            ...mod
                        })
                        if (!parsed.success) {
                            console.error('failed consequence update', parsed.error.issues)
                            return
                        }
                        update(parsed.data)
                    }}
                />
                {(consequence.type === 'sequence') && (
                    <AddItemButton
                        itemTypeName={'sequence'}
                        onEntry={(id) => {
                            dispatchDesignUpdate({
                                type: 'create-data-item', property: 'sequences', data: makeBlankSequence(id)
                            })
                            update({ ...consequence, sequence: id })
                        }}
                        dataTypeArray={gameDesign.sequences} />
                )}
                {(consequence.type === 'storyBoardConsequence') && (
                    <AddItemButton
                        itemTypeName={'storyBoard'}
                        onEntry={(id) => {
                            dispatchDesignUpdate({
                                type: 'create-data-item', property: 'storyBoards', data: makeEmptyStoryBoard(id)
                            })
                            update({ ...consequence, storyBoardId: id })
                        }}
                        dataTypeArray={gameDesign.storyBoards ?? []} />
                )}
                {(consequence.type === 'conversation') && (
                    <AddItemButton
                        itemTypeName={'conversation'}
                        onEntry={(id) => {
                            dispatchDesignUpdate({
                                type: 'create-data-item', property: 'conversations', data: makeBlankConversation(id)
                            })
                            update({ ...consequence, conversationId: id })
                        }}
                        dataTypeArray={gameDesign.storyBoards ?? []} />
                )}
                {(consequence.type === 'order') && (
                    <ArrayControl color="secondary"
                        list={consequence.orders}
                        describeItem={(order, index) =>
                            <OrderCard order={order} handleEditButton={() => setDialogOrderIndex(index)} />
                        }
                        createItem={() => getDefaultOrder('say')}
                        customCreateButton={index => (
                            <OrderTypeButtons
                                handler={(type) => () => {
                                    updateOrders(insertAt(index, getDefaultOrder(type), consequence.orders ?? []))
                                    setDialogOrderIndex(index)
                                }}
                            />
                        )}
                        mutateList={newList => { updateOrders(newList) }}
                    />
                )}
            </Box>

            {needsRoomPreview &&
                <ConsequenceFormRoom setPoint={point => update({ ...consequence, ...point })} consequence={consequence} />
            }
            {needsSoundPreview &&
                <SoundPreview asset={soundAsset ?? {}} />
            }
            {actor && (
                <SpritePreview data={actor} noBaseLine />
            )}
            {(consequence.type === 'order' && typeof orderIndexDialog === 'number') && (
                <OrderDialog
                    order={consequence.orders?.[orderIndexDialog]}
                    actorId={consequence.actorId}
                    index={orderIndexDialog}
                    close={() => setDialogOrderIndex(undefined)}
                    changeOrder={(newOrder) => { editOrder(newOrder, orderIndexDialog) }}
                />
            )}
        </Box>
    )
}
