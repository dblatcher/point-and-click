import AnimationIcon from '@mui/icons-material/Animation';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CameraIndoorOutlinedIcon from '@mui/icons-material/CameraIndoorOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MusicNote from "@mui/icons-material/MusicNote";
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import PictureInPictureAltOutlinedIcon from '@mui/icons-material/PictureInPictureAltOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import RouteIcon from '@mui/icons-material/Route';
import SurroundSoundIcon from '@mui/icons-material/SurroundSound';
import { Tooltip } from "@mui/material";
import { Consequence, ConsequenceType, Order } from "point-click-lib";
import { ChangePlayerCharacterIcon, ConversationIcon, ExclamationIcon, FlagCircleIcon, SequenceIcon, SetActorPlayableIcon, SlideshowIcon, SoundIcon } from "../material-icons";

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


const CONSEQUENCE_DISPLAY_NAMES: Partial<Record<ConsequenceType, string>> = {
    'teleportActor': 'teleport actor',
    'removeActor': 'remove actor',
    'setActorPlayable': 'set playable',
    'conversation': 'conversation',
    'sequence': 'sequence',
    'storyBoardConsequence': 'story board',
    'changePlayerCharacter': 'set player actor',
    'changeRoom': 'change room',
    'ambientNoise': 'set ambient noise',
    'backgroundMusic': 'set room BGM',
    'soundEffect': 'play SFX',
    'order': 'give orders',
    changeStatus: 'change status',
    flag: 'set flag',
    toggleZone: 'zone on/off',
    conversationChoice: 'choice on/off'
}
export const getConsequenceDisplayName = (consequenceType: ConsequenceType): string => CONSEQUENCE_DISPLAY_NAMES[consequenceType] ?? consequenceType;


export const getConsequenceIcon = (type: ConsequenceType): typeof ChatOutlinedIcon => {
    switch (type) {
        case "conversation":
        case "conversationChoice":
            return ConversationIcon
        case "changeRoom":
            return CameraIndoorOutlinedIcon
        case "inventory":
            return Inventory2OutlinedIcon
        case "removeActor":
            return PersonOffOutlinedIcon
        case "teleportActor":
            return PersonPinCircleOutlinedIcon
        case "soundEffect":
            return SoundIcon
        case "flag":
            return FlagCircleIcon
        case "toggleZone":
            return PictureInPictureAltOutlinedIcon
        case "sequence":
            return SequenceIcon
        case "order":
            return AssignmentOutlinedIcon
        case "backgroundMusic":
            return MusicNote
        case "ambientNoise":
            return SurroundSoundIcon
        case 'changePlayerCharacter':
            return ChangePlayerCharacterIcon
        case "storyBoardConsequence":
            return SlideshowIcon
        case "setActorPlayable":
            return SetActorPlayableIcon
        case "changeStatus":
        default:
            return ExclamationIcon
    }
}

export const ConsequenceIconWithDescription = (props: { consequence: Consequence }) => {
    const Icon = getConsequenceIcon(props.consequence.type)
    return <Tooltip title={getConsequenceDescription(props.consequence)} ><Icon /></Tooltip>
}

const UNSET = '[UNSET]'
const NONE = '[NONE]'
const PLAYER = '[PLAYER]'
const quoted = (text?: string) => text ? `"${text}"` : UNSET;
const quotedNone = (text?: string) => text ? `"${text}"` : NONE;
const brackets = (text?: string) => text ? `(${text})` : '';
const defaulted = (text?: string) => (text && text.length > 0) ? text : UNSET;
const actorForOrder = (actorId?: string) => (actorId && actorId.length > 0) ? actorId : PLAYER;

export const getConsequenceDescription = (c: Consequence): string => {
    switch (c.type) {
        case "conversation":
            return `${c.end ? 'stop' : 'start'} ${c.conversationId}`
        case "changeRoom":
            return `room: ${defaulted(c.roomId)} ${c.takePlayer ? '(player comes)' : ''}`
        case "inventory":
            return `${c.addOrRemove} ${c.itemId} ${c.addOrRemove === 'ADD' ? 'TO' : 'FROM'} ${c.actorId ?? PLAYER} `
        case "removeActor":
            return `remove actor ${defaulted(c.actorId)}`;
        case "teleportActor":
            return `${defaulted(c.actorId)} TO ${c.roomId || UNSET}`
        case "order":
            return `${actorForOrder(c.actorId)}: ${c.orders.map(order => order.type).join('; ')}`
        case "flag":
            return `set ${quoted(c.flag)} to ${c.on ? 'ON' : 'OFF'}`
        case "soundEffect":
            return `play sfx: ${quoted(c.sound)}`
        case "toggleZone":
            return `${c.on ? 'Activate' : 'Deactivate'} ${c.zoneType} ${quoted(c.ref)} in room ${defaulted(c.roomId)}`
        case "conversationChoice":
            return `${c.on ? 'Activate' : 'Deactivate'} choice ${quoted(c.branchId)} / ${quoted(c.choiceRef)} in  ${c.conversationId ?? UNSET}`
        case "sequence":
            return `run ${quoted(c.sequence)}`
        case "changeStatus":
            return `${defaulted(c.targetId)}${brackets(c.targetType)} status =  ${quoted(c.status)}`
        case "backgroundMusic":
            return `Set BGM in room ${defaulted(c.roomId)} to ${quotedNone(c.sound)} ${brackets(c.volume?.toString())}`
        case "ambientNoise":
            return `Set ambient noise in room ${defaulted(c.roomId)} to ${quotedNone(c.sound)} ${brackets(c.volume?.toString())}`
        case "storyBoardConsequence":
            return `Run story board ${quoted(c.storyBoardId)}`
        case "changePlayerCharacter":
            return `Change player character to ${defaulted(c.actorId)}`
        case "setActorPlayable":
            return `Makes ${defaulted(c.actorId)} ${c.canBePlayer ? "playable" : "not playable"}`
    }
}