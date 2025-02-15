import { Consequence, ConsequenceType, Order } from "@/definitions";
import AnimationIcon from '@mui/icons-material/Animation';
import CameraIndoorOutlinedIcon from '@mui/icons-material/CameraIndoorOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

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
import { FlagCircleIcon } from "../material-icons";

import SurroundSoundIcon from '@mui/icons-material/SurroundSound';
import MusicNote from "@mui/icons-material/MusicNote";

export const getOrderIcon = (orderType?: Order['type']): typeof ChatOutlinedIcon => {
    switch (orderType) {
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


export const getConsequenceIcon = (type: ConsequenceType): typeof ChatOutlinedIcon => {
    switch (type) {
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
            return FlagCircleIcon
        case "toggleZone":
            return PictureInPictureAltOutlinedIcon
        case "sequence":
            return FormatListNumberedRtlOutlinedIcon
        case "ending":
            return CancelPresentationOutlinedIcon
        case "order":
            return AssignmentOutlinedIcon
        case "backgroundMusic":
            return MusicNote
        case "ambientNoise":
            return SurroundSoundIcon
        case "changeStatus":
        default:
            return PriorityHighOutlinedIcon
    }
}

const UNSET = '[UNSET]'
const NONE = '[NONE]'
const PLAYER = '[PLAYER]'
const quoted = (text?: string) => text ? `"${text}"` : UNSET;
const quotedNone = (text?: string) => text ? `"${text}"` : NONE;
const brackets = (text?: string) => text ? `(${text})` : '';

export const getConsequenceDescription = (c: Consequence): string => {
    switch (c.type) {
        case "conversation":
            return `${c.end ? 'stop' : 'start'} ${c.conversationId}`
        case "changeRoom":
            return `room: ${c.roomId ?? UNSET} ${c.takePlayer ? '(player comes)' : ''}`
        case "inventory":
            return `${c.addOrRemove} ${c.itemId} ${c.addOrRemove === 'ADD' ? 'TO' : 'FROM'} ${c.actorId ?? PLAYER} `
        case "removeActor":
            return `remove actor ${c.actorId ?? UNSET}`;
        case "teleportActor":
            return `${c.actorId || UNSET} TO ${c.roomId || UNSET}`
        case "order":
            return `${c.actorId ?? PLAYER}: ${c.orders.map(order => order.type).join('; ')}`
        case "flag":
            return `set ${c.flag || UNSET} to ${c.on ? 'ON' : 'OFF'}`
        case "soundEffect":
            return `play sfx: ${c.sound ?? UNSET}`
        case "toggleZone":
            return `${c.on ? 'Activate' : 'Deactivate'} ${c.zoneType} ${quoted(c.ref)} in room ${c.roomId ?? UNSET}`
        case "conversationChoice":
            return `${c.on ? 'Activate' : 'Deactivate'} choice ${quoted(c.branchId)} / ${quoted(c.choiceRef)} in  ${c.conversationId ?? UNSET}`
        case "sequence":
            return `run ${quoted(c.sequence)}`
        case "changeStatus":
            return `${c.targetId ?? UNSET}${brackets(c.targetType)} status =  ${quoted(c.status)}`
        case "ending":
            return `Ending: ${quoted(c.endingId)}`
        case "backgroundMusic":
            return `Set BGM in room ${c.roomId ?? UNSET} to ${quotedNone(c.sound)} ${brackets(c.volume?.toString())}`
        case "ambientNoise":
            return `Set ambient noise in room ${c.roomId ?? UNSET} to ${quotedNone(c.sound)} ${brackets(c.volume?.toString())}`
        case "storyBoardConsequence":
            return `Run story board "${c.storyBoardId}"`
        default:
            return "[description]"
    }
}