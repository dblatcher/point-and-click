import { ConceptCard } from "@/components/GameEditor/ConceptCard";
import { Consequence } from "@/definitions";
import { getConsequenceIcon } from "./get-icons";

interface Props {
    consequence: Consequence;
    handleEditButton: { (): void }
    width?: number
}

const UNSET = '[UNSET]'
const PLAYER = '[PLAYER]'
const quoted = (text?: string) => text ? `"${text}"` : UNSET;
const brackets = (text?: string) => text ? `(${text})` : '';

const getDescription = (c: Consequence): string => {
    switch (c.type) {
        case "conversation":
            return `${c.end ? 'stop' : 'start'} ${c.conversationId}`
        case "changeRoom":
            return `room: ${c.roomId ?? UNSET} ${c.takePlayer ? '(player comes)' : ''}`
        case "inventory":
            return `${c.addOrRemove} ${c.itemId} TO ${c.actorId ?? PLAYER} `
        case "removeActor":
            return c.actorId ?? UNSET;
        case "teleportActor":
            return `${c.actorId || UNSET} TO ${c.roomId || UNSET}`
        case "order":
            return `${c.actorId ?? PLAYER}: ${c.orders.map(order => order.type).join('; ')}`
        case "flag":
            return `set ${c.flag ?? UNSET} to ${c.on ? 'ON' : 'OFF'}`
        case "soundEffect":
            return `play sfx: ${c.sound ?? UNSET}`
        case "toggleZone":
            return `${c.on ? 'Activate' : 'Deactivate'} ${c.zoneType} ${quoted(c.ref)} in room ${c.roomId ?? UNSET}`
        case "conversationChoice":
            return `${c.on ? 'Activate' : 'Deactivate'} choice ${quoted(c.branchId)} / ${quoted(c.choiceRef)} in  ${c.conversationId ?? UNSET}`
        case "sequence":
            return `run ${quoted(c.sequence)}`
        case "changeStatus":
            return `${c.targetId??UNSET}${brackets(c.targetType)} status =  ${quoted(c.status)}`
        case "ending":
            return quoted(c.endingId)
        default:
            return "[description]"
    }

}

export const ConsequenceCard = ({ consequence, handleEditButton, width }: Props) => (
    <ConceptCard
        Icon={getConsequenceIcon(consequence)}
        handleClick={handleEditButton}
        description={getDescription(consequence)}
        title={consequence.type}
        narrative={consequence.narrative}
        width={width}
    />
)
