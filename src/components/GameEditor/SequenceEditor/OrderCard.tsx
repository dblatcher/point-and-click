import { Order } from "point-click-lib";
import { getOrderIcon } from "./get-order-details";
import { Box, Card, CardActionArea, Typography } from "@mui/material";

interface Props {
    order: Order;
    handleEditButton?: { (): void }
    width?: number
}

const truncate = (text: string, limit = 35) => text.length > limit ? text.substring(0, limit - 3) + "..." : text;

const getDescription = (order: Order): string => {
    switch (order.type) {
        case "move":
            return `${order.steps.length}x steps`
        case "act": {
            const actions = order.steps.map(step => step.animation);
            if (actions.length > 3) {
                return `${actions.length}x actions`
            }
            return truncate(actions.join())
        }
        case "say": {
            return `"${truncate(order.text)}"`
        }
        case "goTo":
            return `go to: ${order.targetId || '[UNSET]'}`
    }
}

export const OrderCard = ({ order, handleEditButton, width }: Props) => {
    const Wrapper = handleEditButton ? CardActionArea : 'div';
    const Icon = getOrderIcon(order.type);

    return <Card title={handleEditButton ? `edit ${order.type} order` : undefined} sx={{ width }}>
        <Wrapper onClick={handleEditButton}>
            <Box display={'inline-flex'} alignItems={'center'} paddingX={2}>
                <Icon color={'secondary'} />
                <Typography>{getDescription(order)}</Typography>
            </Box>
        </Wrapper>
    </Card>
}
