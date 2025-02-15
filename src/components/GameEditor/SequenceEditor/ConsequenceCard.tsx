import { ConceptCard } from "@/components/GameEditor/ConceptCard";
import { Consequence } from "@/definitions";
import { getConsequenceIcon, getConsequenceDescription } from "./get-order-details";
import { Tooltip } from "@mui/material";

interface Props {
    consequence: Consequence;
    handleEditButton: { (): void }
    width?: number
}


export const ConsequenceIcon = (props: { consequence: Consequence }) => {
    const Icon = getConsequenceIcon(props.consequence.type)
    return  <Tooltip title={getConsequenceDescription(props.consequence)} ><Icon/></Tooltip>
}

export const ConsequenceCard = ({ consequence, handleEditButton, width }: Props) => (
    <ConceptCard
        Icon={getConsequenceIcon(consequence.type)}
        handleClick={handleEditButton}
        description={getConsequenceDescription(consequence)}
        title={consequence.type}
        narrative={consequence.narrative}
        width={width}
    />
)
