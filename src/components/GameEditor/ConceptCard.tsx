import { Narrative } from '@/definitions/BaseTypes';
import { Box, Card, CardActionArea, CardActions, Typography } from "@mui/material";
import { DescriptionOutlinedIcon, IconComponent } from './material-icons';
import { ReactNode } from 'react';

interface Props {
    Icon?: IconComponent;
    title: string;
    handleClick?: { (): void }
    width?: number
    children?: ReactNode
    actions?: ReactNode
    palette?: 'secondary' | 'primary'
}

export const ConceptCard = ({ Icon, handleClick, title, width, children, palette = 'secondary', actions }: Props) => {
    const Wrapper = handleClick ? CardActionArea : "div";
    return (
        <Card
            sx={{ maxWidth: width, minWidth: width, borderColor: `${palette}.light` }}
            variant="outlined"
        >
            <Wrapper onClick={handleClick}>
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
            {!!actions && <CardActions disableSpacing >{actions}</CardActions>}
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