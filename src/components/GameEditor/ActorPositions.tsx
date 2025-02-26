import { useGameDesign } from "@/context/game-design-context";
import { List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { EditorBox } from "./EditorBox";
import { CheckBoxIcon, CheckBoxOutlineBlankIcon } from "./material-icons";

interface Props {
    actorId?: string,
    setActorId: { (actorId?: string): void }
}

export const ActorPositions = ({ actorId, setActorId }: Props) => {
    const { gameDesign } = useGameDesign();
    const handleClick = (id: string) => () => {
        setActorId(actorId === id ? undefined : id)
    }

    return (
        <EditorBox title="Actor Positions" contentBoxProps={{ minWidth: 160, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <List dense disablePadding>
                {gameDesign.actors.map((actor, index) => (
                    <ListItemButton key={index} onClick={handleClick(actor.id)}>
                        <ListItemIcon>
                            {actorId === actor.id ? (
                                <CheckBoxIcon />
                            ) : (
                                <CheckBoxOutlineBlankIcon />
                            )}
                        </ListItemIcon>
                        <ListItemText id={`starting-actor-item-${index}`} primary={actor.id} secondary={actor.room} />
                    </ListItemButton>
                ))}
            </List>
        </EditorBox>
    )
}