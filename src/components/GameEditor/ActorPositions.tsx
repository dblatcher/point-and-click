import { useGameDesign } from "@/context/game-design-context";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { patchMember } from "@/lib/update-design";
import { findById } from "@/lib/util";
import { Dialog, DialogContent, DialogTitle, List, ListItemButton, ListItemText } from "@mui/material";
import { useState } from "react";
import { StringInput } from "../SchemaForm/StringInput";
import { PositionPreview } from "./ActorEditor/PositionPreview";
import { EditorBox } from "./EditorBox";


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
                <DialogTitle>Position:  {actorToPosition?.name ?? actorToPosition?.id}</DialogTitle>
                <DialogContent>
                    {actorToPosition && (<>
                        <StringInput optional value={actorToPosition.status ?? ''} label="status"
                            suggestions={getStatusSuggestions(actorToPosition.id, gameDesign)}
                            inputHandler={(status) => applyModification(
                                `set ${actorToPosition.id} status to ${status}`,
                                { actors: patchMember(actorToPosition.id, { status }, gameDesign.actors) }
                            )}
                        />
                        <PositionPreview actorData={actorToPosition} updateFromPartial={(mod) => {
                            applyModification(
                                `move ${actorToPosition.id}`,
                                { actors: patchMember(actorToPosition.id, mod, gameDesign.actors) }
                            )
                        }} />
                    </>)}
                </DialogContent>
            </Dialog>
        </EditorBox>
    )
}