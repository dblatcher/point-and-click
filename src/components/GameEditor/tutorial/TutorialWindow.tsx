import { useGameDesign } from "@/context/game-design-context"
import { Tutorial } from "@/lib/game-design-logic/types"
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { CheckBoxIcon, CheckBoxOutlineBlankIcon } from "../material-icons"
import { useState } from "react"

interface Props {
    tutorial: Tutorial
}

export const TutorialWindow = ({ tutorial }: Props) => {

    const editorState = useGameDesign()
    const [stageIndex, setStageIndex] = useState(0)
    const progressToNextStage = () => {
        setStageIndex(index => index + 1)
    }

    const currentStage = tutorial.stages[stageIndex];
    const stageComplete = currentStage.tasks.every(task => task.test(editorState))
    const onLastStage = stageIndex + 1 === tutorial.stages.length;

    return <Box flex={1.5} padding={1} sx={{transform:'scale(.75)', transformOrigin:'top left'}}>
        <Typography variant="h2">
            {tutorial.title}
        </Typography>
        {currentStage && (

            <Box>
                {currentStage.subtitle && <Typography variant="h3">{currentStage.subtitle}</Typography>}
                {currentStage.intro}

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
                {stageComplete && (
                    <Box>
                        <Typography>{currentStage.confirmation}</Typography>
                        {!onLastStage && (
                            <Button onClick={progressToNextStage}>next</Button>
                        )}
                    </Box>
                )}
            </Box>
        )}
    </Box>

}