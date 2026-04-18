import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from "@mui/material";
import { Consequence } from "point-click-lib";
import { ShortcutsForConsequence } from "../EditorShortcut";
import { ConsequenceForm } from "../InteractionEditor/ConsequenceForm";
import { NarrativeEditor } from "../NarrativeEditor";
import { getConsequenceDescription, getConsequenceIcon } from "./get-order-details";

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
                <ShortcutsForConsequence consequence={consequence} />
                <NarrativeEditor narrative={consequence.narrative} update={narrative => handleConsequenceUpdate({ ...consequence, narrative })} />
                <Button onClick={close}>done</Button>
            </DialogActions>
        </Dialog>
    )
}