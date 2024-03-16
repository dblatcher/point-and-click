import { Consequence, Order } from "@/definitions";
import AnimationIcon from '@mui/icons-material/Animation';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import RouteIcon from '@mui/icons-material/Route';
import CameraIndoorOutlinedIcon from '@mui/icons-material/CameraIndoorOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PersonRemoveAlt1OutlinedIcon from '@mui/icons-material/PersonRemoveAlt1Outlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import TransferWithinAStationOutlinedIcon from '@mui/icons-material/TransferWithinAStationOutlined';

export const getOrderIcon = (order?: Order): typeof ChatOutlinedIcon => {
    switch (order?.type) {
        case "move":
            return RouteIcon
        case "act":
            return AnimationIcon
        case "say":
            return ChatOutlinedIcon
        case "goTo":
            return PlaceIcon
        default:
            return QuestionMarkIcon
    }
}


export const getConsequenceIcon = (consequence?: Consequence): typeof ChatOutlinedIcon => {
    switch (consequence?.type) {
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
        case "order":
        case "ending":
        case "toggleZone":
        case "soundEffect":
        case "flag":
        case "conversationChoice":
        case "sequence":
        case "changeStatus":
        default:
            return PriorityHighOutlinedIcon
    }
}