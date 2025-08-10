import { Narrative } from '@/definitions/BaseTypes';
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { DescriptionOutlinedIcon, IconComponent } from './material-icons';
import { ReactNode } from 'react';

interface Props {
    Icon?: IconComponent;
    title: string;
    handleClick?: { (): void }
    width?: number
    children?: ReactNode
    palette?: 'secondary' | 'primary'
}

export const ConceptCard = ({ Icon, handleClick, title, width, children, palette = 'secondary' }: Props) => {

    const Wrapper = handleClick ? CardActionArea : "div";

    return (
        <Card onClick={handleClick}
            sx={{ maxWidth: width, minWidth: width, borderColor: `${palette}.light` }}
            variant="outlined"
        >
            <Wrapper>
                <Box display={'flex'} alignItems={'center'}
                    sx={{ backgroundColor: `${palette}.light`, paddingX: 1, paddingY: .25 }}
                >
                    {Icon && <Icon fontSize="large" color={'inherit'} />}
                    <Box paddingLeft={.5} flex={1}>
                        <Typography variant="h6" component={'span'}>{title}</Typography>
                    </Box>
                </Box>
                {children}
            </Wrapper>
        </Card >
    )
}

type TextProps = Omit<Props, 'children'> & {
    text: string;
    narrative?: Narrative
}

export const TextConceptCard = ({ text, narrative, ...rest }: TextProps) => {
    return <ConceptCard {...rest}>

        <Box
            display={'flex'}
            justifyContent={'space-between'}
            maxWidth={rest.width}
            sx={{ paddingX: 1, paddingY: .25 }}
        >
            <Typography >{text}</Typography>
            {narrative && <DescriptionOutlinedIcon />}
        </Box>


    </ConceptCard>
}