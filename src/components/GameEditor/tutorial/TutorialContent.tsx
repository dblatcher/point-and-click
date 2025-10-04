import { useGameDesign } from "@/context/game-design-context"
import { TutorialStage } from "@/lib/game-design-logic/types"
import { Box, Button, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { CheckBoxIcon, CheckBoxOutlineBlankIcon } from "../material-icons"

interface Props {

    currentStage: TutorialStage
    onLastStage: boolean
    progressToNextStage: { (): void }
}

export const TutorialContent = ({ currentStage, onLastStage, progressToNextStage }: Props) => {

    const editorState = useGameDesign()
    const stageComplete = currentStage.tasks.every(task => task.test(editorState))

    return <Box>
        {currentStage.tasks.length > 0 ? (
            <Grid container>
                <Grid item xs={12} lg={4}>
                    {currentStage.subtitle && <Typography variant="h3">{currentStage.subtitle}</Typography>}
                    {currentStage.intro}
                </Grid>
                <Grid item xs={12} lg={8}>
                    <List dense disablePadding>
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
                </Grid>
            </Grid>
        ) : (
            <Box>
                {currentStage.subtitle && <Typography variant="h3">{currentStage.subtitle}</Typography>}
                {currentStage.intro}
            </Box>
        )}
        <Box>
            {stageComplete && (
                <Box>
                    <Typography>{currentStage.confirmation}</Typography>
                    {!onLastStage && (
                        <Button onClick={progressToNextStage}>next</Button>
                    )}
                </Box>
            )}
        </Box>
    </Box >

}