import { ConceptCard } from "@/components/GameEditor/ConceptCard";
import { Consequence } from "@/definitions";
import { getConsequenceIcon } from "./get-icons";

interface Props {
    consequence: Consequence;
    handleEditButton: { (): void }
}

const UNSET = '[UNSET]'
const PLAYER = '[PLAYER]'

const getDescription = (consequence: Consequence): string => {
    switch (consequence.type) {
        case "conversation":
            return `${consequence.end ? 'stop' : 'start'} ${consequence.conversationId}`
        case "changeRoom":
            return `room: ${consequence.roomId ?? UNSET} ${consequence.takePlayer ? '(player comes)' : ''}`
        case "inventory":
            return `${consequence.addOrRemove} ${consequence.itemId} TO ${consequence.actorId ?? PLAYER} `
        case "removeActor":
            return consequence.actorId ?? UNSET;
        case "teleportActor":
            return `${consequence.actorId || UNSET} TO ${consequence.roomId || UNSET}`
        case "order":
            return `${consequence.actorId ?? PLAYER}: ${consequence.orders.map(order => order.type).join('; ')}`
        case "flag":
            return `set ${consequence.flag ?? UNSET} to ${consequence.on ? 'ON' : 'OFF'}`
        case "soundEffect":
            return `play sfx: ${consequence.sound ?? UNSET}`
        case "ending":
        case "toggleZone":
        case "conversationChoice":
        case "sequence":
        case "changeStatus":
        default:
            return "[description]"
    }

}

export const ConsequenceCard = ({ consequence, handleEditButton }: Props) => (
    <ConceptCard
        Icon={getConsequenceIcon(consequence)}
        handleClick={handleEditButton}
        description={getDescription(consequence)}
        title={consequence.type}
        narrative={consequence.narrative}
    />
)
