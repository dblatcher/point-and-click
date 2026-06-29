import { useGameDesign } from "@/context/game-design-context";
import { List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { EditorBox } from "../layout/EditorBox";
import { UndoIcon } from "../material-icons";


export const HistoryList = () => {
    const { dispatchDesignUpdate, history } = useGameDesign();

    return <EditorBox title="history" boxProps={{ width: "100%", minHeight: 400 }}>
        <List>
            {history.length === 0 && (
                <ListItem>
                    <ListItemText>[no modifications]</ListItemText>
                </ListItem>
            )}
            {history.map((item, index) => (
                <ListItem key={index}>
                    <ListItemText>{item.label}</ListItemText>
                    {index === history.length - 1 && (
                        <ListItemButton onClick={() => dispatchDesignUpdate({ type: 'undo' })}>
                            <Typography>undo</Typography>
                            <UndoIcon />
                        </ListItemButton>
                    )}
                </ListItem>
            ))}
        </List>
    </EditorBox>
}