import { Order } from "@/definitions";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PlaceIcon from '@mui/icons-material/Place';
import RouteIcon from '@mui/icons-material/Route';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

interface Props {
    order: Order;
    orderIndex: number
    handleEditButton: { (): void }
}


const getIcon = (order: Order): typeof ChatBubbleOutlineIcon => {
    switch (order.type) {
        case "move":
            return RouteIcon
        case "act":
            return EmojiEmotionsIcon
        case "say":
            return ChatBubbleOutlineIcon
        case "goTo":
            return PlaceIcon
    }
}

const getDescription = (order: Order): string => {
    switch (order.type) {
        case "move":
            return `Follow path, ${order.steps.length} steps`
        case "act": {
            const actions = order.steps.map(step => step.animation);
            return `actions: ${actions.join()}`
        }
        case "say": {
            const text = order.text.length > 50 ? order.text.substring(0, 47) + "..." : order.text
            return `"${text}"`
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
            sx={{ padding: 1, maxWidth: 200, minWidth: 200 }}
            variant="outlined"
        >
            <CardActionArea>
                <Box display={'flex'} flexWrap={'wrap'} alignItems={'flex-start'}>
                    <Icon fontSize="large" color={'secondary'} />
                    <Typography component={'span'} >
                        {description}
                    </Typography>
                </Box>
            </CardActionArea>
        </Card >
    )
}