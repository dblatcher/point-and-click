import { Box, Card, CardActionArea, Typography } from "@mui/material";
import type AnimationIcon from '@mui/icons-material/Animation';


interface Props {
    Icon: typeof AnimationIcon;
    description: string;
    title: string;
    handleClick: { (): void }
}

export const ConceptCard = ({ Icon, handleClick, title, description }: Props) => {

    return (
        <Card onClick={handleClick}
            sx={{ maxWidth: 180, minWidth: 180 }}
            variant="outlined"
        >
            <CardActionArea
                sx={{ padding: 1 }}
            >
                <Box display={'flex'} alignItems={'flex-start'}>
                    <Icon fontSize="large" color={'secondary'} />
                    <Box paddingLeft={1} flex={1}>
                        <Typography variant="caption" borderBottom={1}>{title}</Typography>
                        <Typography >
                            {description}
                        </Typography>
                    </Box>
                </Box>
            </CardActionArea>
        </Card >
    )
}