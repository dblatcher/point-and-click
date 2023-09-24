import { Order } from "@/definitions";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import RouteIcon from '@mui/icons-material/Route';
import AnimationIcon from '@mui/icons-material/Animation';

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

export const OrderCard = ({ order, handleEditButton }: Props) => {
    const Icon = getIcon(order)
    const description = getDescription(order)
    return (
        <Card onClick={handleEditButton}
            sx={{ maxWidth: 180, minWidth: 180 }}
            variant="outlined"
        >
            <CardActionArea
                sx={{ padding: 1 }}
            >
                <Box display={'flex'} alignItems={'flex-start'}>
                    <Icon fontSize="large" color={'secondary'} />
                    <Box paddingLeft={1} flex={1}>
                        <Typography variant="caption" borderBottom={1}>{order.type}</Typography>
                        <Typography >
                            {description}
                        </Typography>
                    </Box>
                </Box>
            </CardActionArea>
        </Card >
    )
}