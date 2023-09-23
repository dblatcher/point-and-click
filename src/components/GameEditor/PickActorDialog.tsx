import { useGameDesign } from "@/context/game-design-context";
import { listIds } from "@/lib/util";
import { Dialog, DialogContent } from "@mui/material";
import { SelectAndConfirmInput } from "./formControls";

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

    return (
        <Dialog open={isOpen} onClose={close}>
            <DialogContent>
                <SelectAndConfirmInput onSelect={onSelect} items={filteredIds} />
            </DialogContent>
        </Dialog>
    )
}