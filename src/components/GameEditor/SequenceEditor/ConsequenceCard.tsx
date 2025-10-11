import { ConceptCard } from "@/components/GameEditor/ConceptCard";
import { Consequence } from "@/definitions";
import { Box, Typography } from "@mui/material";
import { DescriptionOutlinedIcon } from "../material-icons";
import { getConsequenceDescription, getConsequenceIcon } from "./get-order-details";
import { OrderCard } from "./OrderCard";

interface Props {
    consequence: Consequence;
    handleEditButton: { (): void }
    width?: number
    detailed?: boolean
}


const DetailedDescription = ({ consequence, detailed }: Pick<Props, 'consequence' | 'detailed'>) => {
    if (!detailed) { return <Typography >{getConsequenceDescription(consequence)}</Typography> }
    if (consequence.type === 'order') {
        const { orders } = consequence;
        return <Box display={'flex'} gap={2} flexWrap={'wrap'} paddingY={1}>
            {orders.map(order => <OrderCard order={order} />)}
        </Box>

    }
    return <Typography >{getConsequenceDescription(consequence)}</Typography>
}

export const ConsequenceCard = ({ consequence, handleEditButton, width, detailed }: Props) => {

    const title = consequence.type === 'order' ? `${consequence.type}: ${consequence.actorId || "[PLAYER]"}` : consequence.type

    return <ConceptCard
        title={title}
        Icon={getConsequenceIcon(consequence.type)}
        handleClick={handleEditButton}
        width={width}
    >
        <Box
            display={'flex'}
            justifyContent={'space-between'}
            maxWidth={width}
            sx={{ paddingX: 1, paddingY: .25 }}
        >
            <DetailedDescription consequence={consequence} detailed={detailed} />
            {consequence.narrative && <DescriptionOutlinedIcon />}
        </Box>
    </ConceptCard>
}
