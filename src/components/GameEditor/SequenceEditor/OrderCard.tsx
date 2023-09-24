import { Order } from "@/definitions";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import RouteIcon from '@mui/icons-material/Route';
import AnimationIcon from '@mui/icons-material/Animation';

interface Props {
    order: Order;
    orderIndex: number
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
            return `path: ${order.steps.length} steps`
        case "act": {
            const actions = order.steps.map(step => step.animation);
            return `actions: ${actions.join()}`
        }
        case "say": {
            const text = order.text.length > 50 ? order.text.substring(0, 47) + "..." : order.text
            return `say: "${text}"`
        }
        case "goTo":
            return `go to ${order.targetId ?? '?'}`
    }

}

export const OrderCard = ({ order, handleEditButton }: Props) => {
    const Icon = getIcon(order)
    const description = getDescription(order)
    return (
        <Card onClick={handleEditButton}
            sx={{ maxWidth: 200, minWidth: 200 }}
            variant="outlined"
        >
            <CardActionArea
                sx={{ padding: 1 }}
            >
                <Box display={'flex'} alignItems={'flex-start'}>
                    <Icon fontSize="medium" color={'secondary'} />
                    <Typography component={'span'} flex={1}>
                        {description}
                    </Typography>
                </Box>
            </CardActionArea>
        </Card >
    )
}