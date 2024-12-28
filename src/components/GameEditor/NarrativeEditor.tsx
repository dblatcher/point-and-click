import { DescriptionOutlinedIcon } from '@/components/GameEditor/material-icons';
import { Narrative } from "@/definitions/BaseTypes";
import { cloneData } from "@/lib/clone";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { ArrayControl } from "./ArrayControl";
import { DelayedStringInput } from './DelayedStringInput';
import { HelpButton } from "./HelpButton";

interface Props {
    narrative?: Narrative
    update: { (newNarrative: Narrative | undefined): void }
    noDialog?: boolean
    isRequired?: boolean
}

const makeEmptyNarrative = () => ({ text: [""] })

const TextControl = ({ narrative, updateText, updateLine }: {
    narrative?: Narrative,
    updateText: { (newText: string[]): void }
    updateLine: { (text: string, index: number): void }
}) => {
    return (
        <Box paddingTop={5}>
            {!narrative && <Typography>No narrative</Typography>
            }
            {narrative && <>
                <Typography>lines in narrative: {narrative.text.length}</Typography>
                <ArrayControl
                    list={narrative.text}
                    mutateList={updateText}
                    describeItem={(line, index) => (
                        <Box key={index}>
                            <DelayedStringInput delayAfterEdits={5000} type='textArea'
                                value={line} 
                                inputHandler={(newLine) => { updateLine(newLine, index) }} />
                        </Box>
                    )}
                    createItem={() => ""}
                />
            </>}
        </Box>
    )
}

export const NarrativeEditor: React.FunctionComponent<Props> = ({ narrative, update, noDialog, isRequired }) => {
    const { palette } = useTheme()
    const [dialogOpen, setDialogOpen] = useState(false)
    const buttonLabel = !!narrative ? 'edit narrative' : 'add narrative'

    const updateLine = (newLine: string, index: number) => {
        if (!narrative) { return }
        const copy = cloneData(narrative)
        copy.text[index] = newLine
        update(copy)
    }

    const updateText = (newText: string[]) => {
        const copy = cloneData(narrative ?? makeEmptyNarrative())
        copy.text = newText
        update(copy)
    }

    const createNew = () => {
        return update(makeEmptyNarrative())
    }

    if (noDialog) {
        return <Box>
            <TextControl {...{ narrative, updateLine, updateText }} />
            {narrative
                ? !isRequired && <Button onClick={() => update(undefined)}>clear</Button>
                : <Button onClick={createNew}>start narrative</Button>
            }
        </Box>
    }

    return <>
        <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            startIcon={<DescriptionOutlinedIcon />}
        >{buttonLabel}</Button>
        <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
        >
            <DialogTitle sx={{ backgroundColor: palette.secondary.light }}>
                <Stack direction={'row'} alignItems={'center'}>
                    <DescriptionOutlinedIcon fontSize="large" />
                    Edit Narrative
                    <HelpButton helpTopic="narrative" />
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ minWidth: 300 }}>
                <TextControl {...{ narrative, updateLine, updateText }} />
            </DialogContent>
            <DialogActions>
                {narrative
                    ? !isRequired && <Button onClick={() => update(undefined)}>clear</Button>
                    : <Button onClick={createNew}>start narrative</Button>
                }
                <Button onClick={() => { setDialogOpen(false) }}>close</Button>
            </DialogActions>
        </Dialog>
    </>
}