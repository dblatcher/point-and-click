import { useGameDesign } from "@/context/game-design-context"
import { TutorialStage } from "@/lib/game-design-logic/types"
import { Box, Button, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { CheckBoxIcon, CheckBoxOutlineBlankIcon } from "../material-icons"

interface Props {

    currentStage: TutorialStage
    onLastStage: boolean
    progressToNextStage: { (): void }
}

export const TutorialContent = ({ currentStage, onLastStage, progressToNextStage }: Props) => {

    const editorState = useGameDesign()
    const stageComplete = currentStage.tasks.every(task => task.test(editorState))

    return <Box padding={1}>
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