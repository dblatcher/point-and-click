import { useGameDesign } from "@/context/game-design-context";
import { ItemData } from "@/definitions";
import { patchMember } from "@/lib/update-design";
import { List, ListItem, ListItemText, Switch } from "@mui/material";
import { EditorBox } from "./EditorBox";


export const StartingInventory = () => {
    const { gameDesign, applyModification } = useGameDesign();
    const player = gameDesign.actors.find(actor => actor.isPlayer)

    const handleToggle = (item: ItemData, startsWith: boolean) => {
        applyModification(
            `player starts ${startsWith ? 'with' : 'without'} ${item.id}`,
            { items: patchMember(item.id, { actorId: startsWith ? player?.id : undefined }, gameDesign.items) }
        )
    }

    return (
        <EditorBox title="starting inventory" contentBoxProps={{ minWidth: 160, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <List dense disablePadding>
                {gameDesign.items.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText id={`starting-inventory-item-${index}`} primary={item.name ?? item.id} />
                        <Switch size="small" disabled={!player}
                            edge="end"
                            onChange={(_event, checked) => handleToggle(item, checked)}
                            checked={player && item.actorId === player?.id}
                            inputProps={{
                                'aria-labelledby': `starting-inventory-item-${index}`,
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </EditorBox>
    )
}