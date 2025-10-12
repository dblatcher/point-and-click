import { SchemaForm } from "@/components/SchemaForm";
import { useAssets } from "@/context/asset-context";
import { useGameDesign } from "@/context/game-design-context";
import { AnyConsequence, Consequence, GameDesign, Order } from "@/definitions";
import { consequenceMap, consequenceTypes, immediateConsequenceTypes, OrderConsequence, zoneTypes } from "@/definitions/Consequence";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { findById, insertAt, listIds } from "@/lib/util";
import { Box } from "@mui/material";
import { useState } from "react";
import { ZodObject } from "zod";
import { ArrayControl } from "../ArrayControl";
import { OrderTypeButtons } from "../OrderTypeButtons";
import { OrderCard } from "../SequenceEditor/OrderCard";
import { OrderDialog } from "../SequenceEditor/OrderDialog";
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
    const [orderIndexDialog, setDialogOrderIndex] = useState<number>()
    const { ids: targetIds } = getTargetLists(gameDesign)

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

    const updateOrders = (orders: Order[]): void => {
        if (consequence.type !== 'order') {
            return
        }
        update({
            ...consequence as OrderConsequence,
            orders: orders
        })
    }

    const editOrder = (newOrder: Order, index: number): void => {
        const ordersCopy = [...(consequence.orders || [])]
        ordersCopy.splice(index, 1, newOrder)
        updateOrders(ordersCopy)
    }

    const actor = findById(consequence.actorId, gameDesign.actors)

    const needsRoomPreview = ['changeRoom', 'teleportActor', 'toggleZone'].includes(consequence.type)
    const needsSoundPreview = ['soundEffect'].includes(consequence.type)
    const soundAsset = consequence.sound ? soundService.get(consequence.sound) : undefined


    return (
        <Box display={'flex'}>
            <Box paddingY={2}>
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
                        status: getStatusSuggestions(consequence.targetId, gameDesign)
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
                {consequence.orders && (
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
            {typeof orderIndexDialog === 'number' && (
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
