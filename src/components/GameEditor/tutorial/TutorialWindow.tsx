import { useGameDesign } from "@/context/game-design-context"
import { Tutorial } from "@/lib/game-design-logic/types"
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { CheckBoxIcon, CheckBoxOutlineBlankIcon } from "../material-icons"

interface Props {
    tutorial: Tutorial
}

export const TutorialWindow = ({ tutorial }: Props) => {

    const editorState = useGameDesign()

    const stageIndex = 0

    const currentStage = tutorial.stages[stageIndex]

    return <Box flex={1.5} padding={1} sx={{ position: 'sticky', top: 0 }}>
        <Typography variant="h2">
            {tutorial.title}
        </Typography>
        {currentStage && (

            <Box>
                <Typography>{currentStage.intro} </Typography>

                <List>

                    {currentStage.tasks.map((task, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={task.title} secondary={task.detail} />
                            <ListItemIcon>
                                {task.test(editorState) ? <CheckBoxIcon />
                                    : <CheckBoxOutlineBlankIcon />}
                            </ListItemIcon>
                        </ListItem>
                    ))}
                </List>
            </Box>
        )}
    </Box>

}