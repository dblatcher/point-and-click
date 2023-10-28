import { getTargetLists } from "@/components/GameEditor/InteractionEditor/getTargetLists";
import { useGameDesign } from "@/context/game-design-context";
import { Order } from "@/definitions";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { findById } from "@/lib/util";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { OrderForm } from "../OrderForm";

interface Props {
    sequenceId: string
    stage: number
    actorId: string
    index: number
    close: { (): void }
    changeOrder: { (order: Order, index: number): void }
}



export const OrderDialog = ({ sequenceId, stage, index, actorId, close, changeOrder }: Props) => {

    const { gameDesign } = useGameDesign()
    const sequence = findById(sequenceId, gameDesign.sequences)
    const order: Order | undefined = sequence?.stages[stage].actorOrders?.[actorId]?.[index]

    const { ids: targetIdsWithoutItems, descriptions: targetDescriptionsWithoutItems } = getTargetLists(gameDesign, true)

    return (
        <Dialog open={!!order} onClose={close}>
            <DialogTitle>edit order</DialogTitle>
            <DialogContent>
                {order && (
                    <OrderForm
                        data={order}
                        animationSuggestions={getStatusSuggestions(actorId, gameDesign)}
                        targetIdOptions={targetIdsWithoutItems}
                        targetIdDescriptions={targetDescriptionsWithoutItems}
                        updateData={(newOrder) => { changeOrder(newOrder, index) }}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}