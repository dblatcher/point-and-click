import { ConceptCard } from "@/components/GameEditor/ConceptCard";
import { Order } from "@/definitions";
import { getOrderIcon } from "./get-order-details";

interface Props {
    order: Order;
    handleEditButton: { (): void }
    width?: number
}


const getDescription = (order: Order): string => {
    switch (order.type) {
        case "move":
            return `${order.steps.length}x steps`
        case "act": {
            const actions = order.steps.map(step => step.animation);
            return `animations: ${actions.join()}`
        }
        case "say": {
            const text = order.text.length > 35 ? order.text.substring(0, 32) + "..." : order.text
            return `"${text}"`
        }
        case "goTo":
            return order.targetId || '[UNSET]'
    }
}

export const OrderCard = ({ order, handleEditButton, width }: Props) => (
    <ConceptCard
        Icon={getOrderIcon(order.type)}
        handleClick={handleEditButton}
        description={getDescription(order)}
        title={order.type}
        narrative={order.narrative}
        width={width}
    />
)
