import { Narrative } from '@/definitions/BaseTypes';
import type AnimationIcon from '@mui/icons-material/Animation';
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

interface Props {
    Icon: typeof AnimationIcon;
    description: string;
    title: string;
    handleClick: { (): void }
    width?: number
    narrative?: Narrative
}

export const ConceptCard = ({ Icon, handleClick, title, description, width, narrative }: Props) => {

    return (
        <Card onClick={handleClick}
            sx={{ maxWidth: width, minWidth: width, borderColor: 'secondary.light' }}
            variant="outlined"
        >
            <CardActionArea>
                <Box display={'flex'} alignItems={'center'}
                    sx={{ backgroundColor: "secondary.light", paddingX: 1, paddingY: .25 }}
                >
                    <Icon fontSize="large" color={'inherit'} />
                    <Box paddingLeft={.5} flex={1}>
                        <Typography variant="h6" component={'span'}>{title}</Typography>
                    </Box>
                </Box>
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    sx={{ paddingX: 1, paddingY: .25 }}
                >
                    <Typography >
                        {description}
                    </Typography>
                    {narrative && <DescriptionOutlinedIcon />}
                </Box>
            </CardActionArea>
        </Card >
    )
}