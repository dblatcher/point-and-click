import { useGameDesign } from "@/context/game-design-context";
import { findById } from "@/lib/util";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface Props {
    sequenceId: string
    stage: number
    actorId: string
    index: number
    close: { (): void }
}



export const OrderDialog = ({ sequenceId, stage, index, actorId, close }: Props) => {

    const { gameDesign } = useGameDesign()
    const sequence = findById(sequenceId, gameDesign.sequences)
    const order = sequence?.stages[stage].actorOrders?.[actorId]?.[index]

    return (
        <Dialog open={!!order} onClose={close}>
            <DialogTitle>edit order</DialogTitle>
            <DialogContent>
                {order && (
                    <p>
                        {JSON.stringify(order)}
                    </p>
                )}
            </DialogContent>
        </Dialog>
    )
}