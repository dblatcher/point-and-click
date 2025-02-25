import { useGameDesign } from "@/context/game-design-context";
import { ActorData } from "@/definitions";
import { Dialog, DialogContent, List, ListItemButton, ListItemText } from "@mui/material";
import { EditorBox } from "./EditorBox";
import { useState } from "react";
import { findById } from "@/lib/util";
import { PositionPreview } from "./ActorEditor/PositionPreview";
import { patchMember } from "@/lib/update-design";


export const ActorPositions = () => {
    const { gameDesign, applyModification } = useGameDesign();
    const [actorId, setActorId] = useState<string | undefined>(undefined)

    const actorToPosition = findById(actorId, gameDesign.actors)

    return (
        <EditorBox title="Actor Positions" contentBoxProps={{ minWidth: 160, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <List dense disablePadding>
                {gameDesign.actors.map((item, index) => (
                    <ListItemButton key={index} onClick={() => setActorId(item.id)}>
                        <ListItemText id={`starting-actor-item-${index}`} primary={item.name ?? item.id} secondary={item.room} />
                    </ListItemButton>
                ))}
            </List>
            <Dialog fullWidth maxWidth={'md'}
                open={!!actorToPosition}
                onClose={() => setActorId(undefined)}
            >
                <DialogContent>
                    {actorToPosition && (
                        <PositionPreview actorData={actorToPosition} updateFromPartial={(mod) => {
                            applyModification(
                                `move ${actorToPosition.id}`,
                                { actors: patchMember(actorToPosition.id, mod, gameDesign.actors) }
                            )
                        }} />
                    )}
                </DialogContent>
            </Dialog>
        </EditorBox>
    )
}