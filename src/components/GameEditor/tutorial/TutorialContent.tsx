import { useGameDesign } from "@/context/game-design-context"
import { TutorialContext } from "@/context/tutorial-context"
import { Forward } from "@mui/icons-material"
import { Box, Button, Grid, Typography } from "@mui/material"
import { useContext } from "react"
import { TaskList } from "./TaskList"

export const TutorialContent = () => {

    const editorState = useGameDesign()
    const { progressToNextStage, currentStage, onLastStage } = useContext(TutorialContext)
    const stageComplete = currentStage?.tasks.every(task => task.test(editorState))

    if (!currentStage) {
        return null
    }

    return <Box>
        {currentStage.tasks.length > 0 ? (
            <Grid container>
                <Grid item xs={12} lg={4}>
                    {currentStage.subtitle && <Typography variant="h3">{currentStage.subtitle}</Typography>}
                    <Typography component={'div'} fontSize={'small'}>{currentStage.intro}</Typography>
                </Grid>
                <Grid item xs={12} lg={8}>
                    <TaskList stage={currentStage} />
                </Grid>
            </Grid>
        ) : (
            <Box>
                {currentStage.subtitle && <Typography variant="h3">{currentStage.subtitle}</Typography>}
                <Typography component={'div'} fontSize={'small'}>{currentStage.intro}</Typography>
            </Box>
        )}
        <Box>
            {stageComplete && (
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-end'}>
                    <Typography component={'div'} fontSize={'small'}>{currentStage.confirmation}</Typography>
                    {!onLastStage && (
                        <Button
                            size="large"
                            endIcon={<Forward />}
                            color="secondary"
                            onClick={progressToNextStage}>next stage</Button>
                    )}
                </Box>
            )}
        </Box>
    </Box >

}