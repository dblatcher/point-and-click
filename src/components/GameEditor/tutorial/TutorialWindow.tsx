import { Tutorial } from "@/lib/game-design-logic/types"
import { Box, Typography } from "@mui/material"

interface Props {
    tutorial: Tutorial
}

export const TutorialWindow = ({ tutorial }: Props) => {

    return <Box flex={1} padding={1} sx={{position: 'sticky', top: 0 }}>
        <Typography variant="h2">
            {tutorial.title}
        </Typography>
    </Box>

}