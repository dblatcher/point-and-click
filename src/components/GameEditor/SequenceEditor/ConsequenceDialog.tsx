import { Consequence } from "@/definitions";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from "@mui/material";
import { ConsequenceForm } from "../InteractionEditor/ConsequenceForm";
import { getConsequenceDescription, getConsequenceIcon } from "./get-order-details";
import { NarrativeEditor } from "../NarrativeEditor";

interface Props {
    consequence: Consequence
    handleConsequenceUpdate: { (consequence: Consequence): void }
    close: { (): void }
    immediateOnly?: boolean
}


export const ConsequenceDialog = ({ close, handleConsequenceUpdate, consequence, immediateOnly }: Props) => {
    const { palette } = useTheme()
    const IconForConsequenceType = getConsequenceIcon(consequence.type)
    return (
        <Dialog open={!!consequence} onClose={close} fullWidth maxWidth={'md'}>
            <DialogTitle sx={{ backgroundColor: palette.secondary.light }}>
                <Box display="flex" gap={2} alignItems={'center'}>
                    <IconForConsequenceType />
                    <span>edit consequence</span>
                </Box>
                <Typography>{getConsequenceDescription(consequence)}</Typography>
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
            <DialogActions>
                <NarrativeEditor narrative={consequence.narrative} update={narrative => handleConsequenceUpdate({ ...consequence, narrative })} />
                <Button onClick={close}>done</Button>
            </DialogActions>
        </Dialog>
    )
}