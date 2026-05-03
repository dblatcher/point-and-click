import { useGameDesign } from "@/context/game-design-context";
import { TutorialStage } from "@/lib/game-design-logic/types";
import { List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { CheckBoxIcon, CheckBoxOutlineBlankIcon } from "../material-icons";
import { Fragment, useContext } from "react";
import { TutorialContext } from "@/context/tutorial-context";

interface Props {
    stage?: TutorialStage;
    onlyDetailNextTask?: boolean;
    onlyShowCurrent?: boolean;
}

export const TaskList = ({ stage: propStage, onlyDetailNextTask, onlyShowCurrent }: Props) => {
    const editorState = useGameDesign()
    const { currentStage } = useContext(TutorialContext)

    const stage = propStage ?? currentStage;
    if (!stage) {
        return null
    }

    const firstUndoneTaskIndex = stage.tasks.findIndex(task => !task.test(editorState))

    return <List dense disablePadding>
        {stage.tasks.map((task, index) => (
            <Fragment key={index}>
                {(!onlyShowCurrent || index === firstUndoneTaskIndex) && (
                    <ListItem>
                        <ListItemIcon >
                            {task.test(editorState) ? <CheckBoxIcon color="secondary" />
                                : <CheckBoxOutlineBlankIcon color="secondary" />}
                        </ListItemIcon>
                        <ListItemText
                            primary={task.title}
                            secondary={onlyDetailNextTask ? (index === firstUndoneTaskIndex) ? task.detail : undefined : task.detail}
                            sx={{ margin: 0, color: (index === firstUndoneTaskIndex) ? 'secondary.dark' : undefined }} />
                    </ListItem>
                )}
            </Fragment>
        ))}

        {(onlyShowCurrent && firstUndoneTaskIndex === -1) && (
            <Typography component={'div'} fontSize={'small'}>
                All tasks complete for this stage.
            </Typography>
        )}
    </List>
}