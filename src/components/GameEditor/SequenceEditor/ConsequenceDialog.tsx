import { Consequence } from "@/definitions";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { ConsequenceForm } from "../InteractionEditor/ConsequenceForm";

interface Props {
    consequence: Consequence
    handleConsequenceUpdate: { (consequence: Consequence): void }
    close: { (): void }
    immediateOnly?: boolean
}


export const ConsequenceDialog = ({ close, handleConsequenceUpdate, consequence, immediateOnly }: Props) => {
    return (
        <Dialog open={!!consequence} onClose={close}>
            <DialogTitle>edit consequence</DialogTitle>
            <DialogContent>
                {consequence && (
                    <ConsequenceForm
                        consequence={consequence}
                        immediateOnly={immediateOnly}
                        update={handleConsequenceUpdate}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}