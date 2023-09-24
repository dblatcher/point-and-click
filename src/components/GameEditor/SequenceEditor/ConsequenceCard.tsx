import { Consequence } from "@/definitions";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import CameraIndoorOutlinedIcon from '@mui/icons-material/CameraIndoorOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PersonRemoveAlt1OutlinedIcon from '@mui/icons-material/PersonRemoveAlt1Outlined';
import TransferWithinAStationOutlinedIcon from '@mui/icons-material/TransferWithinAStationOutlined';

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
            return PersonRemoveAlt1OutlinedIcon
        case "teleportActor":
            return TransferWithinAStationOutlinedIcon
        case "ending":
        case "toggleZone":
        case "soundEffect":
        case "flag":
        case "conversationChoice":
        case "sequence":
        case "order":
        case "changeStatus":
        default:
            return PriorityHighOutlinedIcon
    }
}

const UNSET= '[UNSET]'

const getDescription = (consequence: Consequence): string => {
    switch (consequence.type) {
        case "conversation":
            return `${consequence.end ? 'stop' : 'start'} ${consequence.conversationId}`
        case "changeRoom":
            return `room: ${consequence.roomId ?? UNSET} ${consequence.takePlayer ? '(player comes)' : ''}`
        case "inventory":
            return `${consequence.addOrRemove} ${consequence.itemId} TO ${consequence.actorId ?? 'player'} `
        case "removeActor":
            return consequence.actorId ?? UNSET;
        case "teleportActor":
            return `${consequence.actorId || UNSET} TO ${consequence.roomId || UNSET}`
        case "ending":
        case "toggleZone":
        case "soundEffect":
        case "flag":
        case "conversationChoice":
        case "order":
        case "sequence":
        case "changeStatus":
        default:
            return "[description]"
    }

}

export const ConsequenceCard = ({ consequence, handleEditButton }: Props) => {
    const Icon = getIcon(consequence)
    const description = getDescription(consequence)
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