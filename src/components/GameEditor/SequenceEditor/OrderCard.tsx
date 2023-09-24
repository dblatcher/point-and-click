import { ConceptCard } from "@/components/ConceptCard";
import { Order } from "@/definitions";
import AnimationIcon from '@mui/icons-material/Animation';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import RouteIcon from '@mui/icons-material/Route';

interface Props {
    order: Order;
    handleEditButton: { (): void }
}


const getIcon = (order: Order): typeof ChatOutlinedIcon => {
    switch (order.type) {
        case "move":
            return RouteIcon
        case "act":
            return AnimationIcon
        case "say":
            return ChatOutlinedIcon
        case "goTo":
            return PlaceIcon
    }
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
            const text = order.text.length > 50 ? order.text.substring(0, 47) + "..." : order.text
            return `"${text}"`
        }
        case "goTo":
            return `${order.targetId ?? '?'}`
    }

}

export const OrderCard = ({ order, handleEditButton }: Props) => (
    <ConceptCard
        Icon={getIcon(order)}
        handleClick={handleEditButton}
        description={getDescription(order)}
        title={order.type}
    />
)
