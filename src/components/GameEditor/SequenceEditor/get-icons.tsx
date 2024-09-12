import { Consequence, Order } from "@/definitions";
import AnimationIcon from '@mui/icons-material/Animation';
import CameraIndoorOutlinedIcon from '@mui/icons-material/CameraIndoorOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import PictureInPictureAltOutlinedIcon from '@mui/icons-material/PictureInPictureAltOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import RouteIcon from '@mui/icons-material/Route';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import FormatListNumberedRtlOutlinedIcon from '@mui/icons-material/FormatListNumberedRtlOutlined';
import CancelPresentationOutlinedIcon from '@mui/icons-material/CancelPresentationOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

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
        case "conversationChoice":
            return ForumOutlinedIcon
        case "changeRoom":
            return CameraIndoorOutlinedIcon
        case "inventory":
            return Inventory2OutlinedIcon
        case "removeActor":
            return PersonOffOutlinedIcon
        case "teleportActor":
            return PersonPinCircleOutlinedIcon
        case "soundEffect":
            return VolumeUpIcon
        case "flag":
            return FlagOutlinedIcon
        case "toggleZone":
            return PictureInPictureAltOutlinedIcon
        case "sequence":
            return FormatListNumberedRtlOutlinedIcon
        case "ending":
            return CancelPresentationOutlinedIcon
        case "order":
            return AssignmentOutlinedIcon
        case "changeStatus":
        default:
            return PriorityHighOutlinedIcon
    }
}