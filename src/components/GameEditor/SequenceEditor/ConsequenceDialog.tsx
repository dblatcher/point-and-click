import { Consequence } from "@/definitions";
import { Dialog, DialogContent, DialogTitle, Stack, useTheme } from "@mui/material";
import { ConsequenceForm } from "../InteractionEditor/ConsequenceForm";
import { getConsequenceIcon } from "./get-icons";

interface Props {
    consequence: Consequence
    handleConsequenceUpdate: { (consequence: Consequence): void }
    close: { (): void }
    immediateOnly?: boolean
}


export const ConsequenceDialog = ({ close, handleConsequenceUpdate, consequence, immediateOnly }: Props) => {
    const { palette } = useTheme()
    const IconForConsequenceType = getConsequenceIcon(consequence)
    return (
        <Dialog open={!!consequence} onClose={close}>
            <DialogTitle sx={{ backgroundColor: palette.secondary.light }}>
                <Stack direction={'row'} alignItems={'center'}>
                    <IconForConsequenceType />
                    edit consequence
                </Stack>
            </DialogTitle>
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