import { Consequence } from "@/definitions";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import CameraIndoorOutlinedIcon from '@mui/icons-material/CameraIndoorOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

interface Props {
    consequence: Consequence;
    handleEditButton: { (): void }
}


const getIcon = (consequence: Consequence): typeof ChatOutlinedIcon => {
    switch (consequence.type) {

        case "conversation":
            return ForumOutlinedIcon
        case "changeRoom":
            return CameraIndoorOutlinedIcon
        case "inventory":
            return Inventory2OutlinedIcon
        case "removeActor":
        case "changeStatus":
        case "sequence":
        case "ending":
        case "teleportActor":
        case "toggleZone":
        case "soundEffect":
        case "flag":
        case "conversationChoice":
        case "order":
        default:
            return PriorityHighOutlinedIcon
    }
}

const getDescription = (consequence: Consequence): string => {
    switch (consequence.type) {
        case "conversation":
            return `${consequence.end ? 'stop' : 'start'} ${consequence.conversationId}`
        case "changeRoom":
            return `room: ${consequence.roomId ?? '[UNSET]'} ${consequence.takePlayer ? '(player comes)' : ''}`
        case "inventory":
            return `${consequence.addOrRemove} ${consequence.itemId} TO ${consequence.actorId ?? 'player'} `
        case "removeActor":
        case "changeStatus":
        case "sequence":
        case "ending":
        case "teleportActor":
        case "toggleZone":
        case "soundEffect":
        case "flag":
        case "conversationChoice":
        case "order":
        default:
            return "[description]"
    }

}

export const ConsequenceCard = ({ consequence, handleEditButton }: Props) => {
    const Icon = getIcon(consequence)
    const description = getDescription(consequence)
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
                    <Box paddingLeft={1} flex={1}>
                        <Typography variant="caption" borderBottom={1}>{consequence.type}</Typography>
                        <Typography >
                            {description}
                        </Typography>
                    </Box>
                </Box>
            </CardActionArea>
        </Card >
    )
}