import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from "@mui/material";
import { Consequence } from "point-click-lib";
import { ShortcutsForConsequence } from "../EditorShortcut";
import { ConsequenceForm } from "../InteractionEditor/ConsequenceForm";
import { NarrativeEditor } from "../NarrativeEditor";
import { getConsequenceDescription, getConsequenceDisplayName, getConsequenceIcon } from "./get-order-details";
import { DialogTutorial } from "../tutorial/sections";

interface Props {
    consequence: Consequence
    handleConsequenceUpdate: { (consequence: Consequence): void }
    close: { (): void }
}


export const ConsequenceDialog = ({ close, handleConsequenceUpdate, consequence }: Props) => {
    const { palette } = useTheme()
    const IconForConsequenceType = getConsequenceIcon(consequence.type)
    return (
        <Dialog open={!!consequence} onClose={close} fullWidth maxWidth={'md'}>
            <DialogTitle sx={{ backgroundColor: palette.secondary.light }}>
                <Box display="flex" gap={2} alignItems={'center'}>
                    <IconForConsequenceType />
                    <span>Edit Consequence</span>
                </Box>
                <Typography>{getConsequenceDisplayName(consequence.type)}: {getConsequenceDescription(consequence)}</Typography>
            </DialogTitle>
            <DialogContent>
                <DialogTutorial />
                {consequence && (
                    <ConsequenceForm
                        consequence={consequence}
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