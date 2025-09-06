import { getTargetLists } from "@/components/GameEditor/InteractionEditor/getTargetLists";
import { useGameDesign } from "@/context/game-design-context";
import { Order } from "@/definitions";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, useTheme } from "@mui/material";
import { NarrativeEditor } from "../NarrativeEditor";
import { OrderForm } from "../OrderForm";
import { getOrderIcon } from "./get-order-details";


interface Props {
    order?:Order
    actorId?: string
    index: number
    close: { (): void }
    changeOrder: { (order: Order, index: number): void }
}



export const OrderDialog = ({ order, index, actorId, close, changeOrder }: Props) => {
    const { palette } = useTheme()
    const { gameDesign } = useGameDesign()
    const { ids: targetIdsWithoutItems, descriptions: targetDescriptionsWithoutItems } = getTargetLists(gameDesign, true)
    const IconForOrderType = getOrderIcon(order?.type)

    return (
        <Dialog open={!!order}
            onClose={close}
            fullWidth
            maxWidth={order?.type === 'move' ? 'md' : undefined}
        >
            <DialogTitle sx={{ backgroundColor: palette.secondary.light }}>
                <Stack direction={'row'} alignItems={'center'}>
                    <IconForOrderType />
                    edit {order?.type} order
                </Stack>
            </DialogTitle>
            <DialogContent>
                {order && (
                    <OrderForm
                        actorId={actorId}
                        data={order}
                        animationSuggestions={getStatusSuggestions(actorId, gameDesign)}
                        targetIdOptions={targetIdsWithoutItems}
                        targetIdDescriptions={targetDescriptionsWithoutItems}
                        updateData={(newOrder) => { changeOrder(newOrder, index) }}
                    />
                )}
                <DialogActions>
                    {order && (
                        <NarrativeEditor
                            narrative={order.narrative}
                            update={newNarrative => changeOrder({ ...order, narrative: newNarrative }, index)}
                        />
                    )}
                    <Button onClick={close}>done</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}