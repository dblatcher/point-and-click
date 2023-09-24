import { Consequence } from "@/definitions";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import CameraIndoorOutlinedIcon from '@mui/icons-material/CameraIndoorOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PersonRemoveAlt1OutlinedIcon from '@mui/icons-material/PersonRemoveAlt1Outlined';
import TransferWithinAStationOutlinedIcon from '@mui/icons-material/TransferWithinAStationOutlined';
import { ConceptCard } from "@/components/ConceptCard";

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

const UNSET = '[UNSET]'

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

export const ConsequenceCard = ({ consequence, handleEditButton }: Props) => (
    <ConceptCard
        Icon={getIcon(consequence)}
        handleClick={handleEditButton}
        description={getDescription(consequence)}
        title={consequence.type}
    />
)
