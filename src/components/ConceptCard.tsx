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
            sx={{ maxWidth: 180, minWidth: 180, borderColor:'secondary.light' }}
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
                    sx={{ paddingX: 1, paddingY: .25 }}
                >
                    <Typography >
                        {description}
                    </Typography>
                </Box>
            </CardActionArea>
        </Card >
    )
}