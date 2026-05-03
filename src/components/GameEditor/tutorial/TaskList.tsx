

import { useGameDesign } from "@/context/game-design-context";
import { TutorialStage } from "@/lib/game-design-logic/types";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { CheckBoxIcon, CheckBoxOutlineBlankIcon } from "../material-icons";
import { useContext } from "react";
import { TutorialContext } from "@/context/tutorial-context";

interface Props {
    stage?: TutorialStage;
    onlyDetailNextTask?: boolean;
}

export const TaskList = ({ stage: propStage, onlyDetailNextTask }: Props) => {
    const editorState = useGameDesign()
    const {currentStage} = useContext(TutorialContext)

    const stage = propStage ?? currentStage;
    if (!stage) {
        return null
    }

    const firstUndoneTaskIndex = stage.tasks.findIndex(task => !task.test(editorState))

    return <List dense disablePadding>
        {stage.tasks.map((task, index) => (
            <ListItem key={index}  >
                <ListItemText
                    primary={task.title}
                    secondary={onlyDetailNextTask ? (index === firstUndoneTaskIndex) ? task.detail : undefined : task.detail}
                    sx={{ margin: 0, color: (index === firstUndoneTaskIndex) ? 'secondary.dark' : undefined }} />
                <ListItemIcon >
                    {task.test(editorState) ? <CheckBoxIcon color="secondary" />
                        : <CheckBoxOutlineBlankIcon color="secondary" />}
                </ListItemIcon>
            </ListItem>
        ))}
    </List>
}