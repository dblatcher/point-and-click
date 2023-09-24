import { useGameDesign } from "@/context/game-design-context";
import { findById, listIds } from "@/lib/util";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useState } from "react";
import { SelectInput } from "../SchemaForm/inputs";
import { SpritePreview } from "./SpritePreview";

interface Props {
    isOpen: boolean;
    excluded?: string[]
    close: { (): void }
    onSelect: { (actorId: string): void }
}

export const PickActorDialog = ({ isOpen, close, excluded, onSelect }: Props) => {
    const { gameDesign } = useGameDesign()
    const ids = listIds(gameDesign.actors)
    const filteredIds = excluded ? ids.filter((id) => !excluded.includes(id)) : ids
    const [actorId, setActorId] = useState<string | undefined>(filteredIds[0])
    const actor = findById(actorId, gameDesign.actors)

    return (
        <Dialog open={isOpen} onClose={close}>
            <DialogTitle>Pick Actor</DialogTitle>
            <DialogContent sx={{ minWidth: 200 }}>
                <Box display='flex' flexDirection={'column'} alignItems={'center'} justifyContent={'center'} minHeight={200}>
                    {actor && (<>
                        <Typography>{actor.name ?? actor.id}</Typography>
                        <SpritePreview noBaseLine scale={1.25}
                            data={actor}
                        />
                    </>
                    )}
                </Box>
                <SelectInput label="actorId" options={filteredIds} value={actorId} inputHandler={(choice) => setActorId(choice)} />
            </DialogContent>

            <DialogActions>
                <Button onClick={close}>cancel</Button>
                <Button
                    variant="contained"
                    onClick={(): void => {
                        if (actorId) {
                            onSelect(actorId);
                            close();
                        }
                    }}
                >Confirm</Button >
            </DialogActions>
        </Dialog>
    )
}