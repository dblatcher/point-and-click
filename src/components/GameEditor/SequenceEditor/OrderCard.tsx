import { ConceptCard } from "@/components/GameEditor/ConceptCard";
import { Order } from "@/definitions";
import { getOrderIcon } from "./get-icons";

interface Props {
    order: Order;
    handleEditButton: { (): void }
}


const getDescription = (order: Order): string => {
    switch (order.type) {
        case "move":
            return `${order.steps.length}x steps`
        case "act": {
            const actions = order.steps.map(step => step.animation);
            return `${actions.join()}`
        }
        case "say": {
            const text = order.text.length > 35 ? order.text.substring(0, 32) + "..." : order.text
            return `"${text}"`
        }
        case "goTo":
            return `${order.targetId ?? '?'}`
    }

}

export const OrderCard = ({ order, handleEditButton }: Props) => (
    <ConceptCard
        Icon={getOrderIcon(order)}
        handleClick={handleEditButton}
        description={getDescription(order)}
        title={order.type}
    />
)
