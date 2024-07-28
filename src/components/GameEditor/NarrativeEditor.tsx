import { Narrative } from "@/definitions/BaseTypes";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { ArrayControl } from "./ArrayControl";
import { StringInput } from "../SchemaForm/StringInput";
import { cloneData } from "@/lib/clone";
import { HelpButton } from "./HelpButton";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

interface Props {
    narrative?: Narrative
    update: { (newNarrative: Narrative | undefined): void }
}


export const NarrativeEditor: React.FunctionComponent<Props> = ({ narrative, update }) => {
    const { palette } = useTheme()
    const [dialogOpen, setDialogOpen] = useState(false)
    const buttonLabel = !!narrative ? 'edit narrative' : 'add narrative'

    const updateLine = (newLine: string, index: number) => {
        if (!narrative) { return }
        const copy = cloneData(narrative)
        copy[index] = newLine
        update(copy)
    }

    const createNew = () => {
        return update([""])
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
                <Box paddingTop={5}>
                    {!narrative && <Typography>No narrative</Typography>
                    }
                    {narrative && <>
                        <Typography>lines in narrative: {narrative.length}</Typography>
                        <ArrayControl
                            list={narrative}
                            mutateList={update}
                            describeItem={(line, index) => (
                                <Box key={index}>
                                    <StringInput value={line} inputHandler={(newLine) => { updateLine(newLine, index) }} />
                                </Box>
                            )}
                            createItem={() => ""}
                        />
                    </>}
                </Box>
            </DialogContent>
            <DialogActions>
                {narrative
                    ? <Button onClick={() => update(undefined)}>clear</Button>
                    : <Button onClick={createNew}>start narrative</Button>
                }
                <Button onClick={() => { setDialogOpen(false) }}>close</Button>
            </DialogActions>
        </Dialog>
    </>
}