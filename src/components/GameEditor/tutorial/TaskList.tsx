

import { useGameDesign } from "@/context/game-design-context";
import { TutorialStage } from "@/lib/game-design-logic/types";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { CheckBoxIcon, CheckBoxOutlineBlankIcon } from "../material-icons";

interface Props {
    currentStage: TutorialStage;
    onlyDetailNextTask?: boolean;
}

export const TaskList = ({ currentStage, onlyDetailNextTask }: Props) => {
    const editorState = useGameDesign()

    const firstUndoneTaskIndex = currentStage.tasks.findIndex(task => !task.test(editorState))



    return <List dense disablePadding>
        {currentStage.tasks.map((task, index) => (
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