import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import { FramePicker } from "./SpriteEditor/FramePicker";

interface Props {
    title?: string;
    disabled?: boolean;
    pickFrame: { (row: number, col: number, imageId?: string): void };
}

const defaultState = () => ({ row: 0, col: 0, imageId: undefined })

export const FramePickDialogButton: React.FunctionComponent<Props> = ({ title, disabled, pickFrame }: Props) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [localFrame, setLocalFrame] = useState<{
        row: number;
        col: number;
        imageId?: string;
    }>(defaultState())

    const handleSelect = () => {
        const { row, col, imageId } = localFrame
        pickFrame(row, col, imageId)
        setDialogOpen(false)
    }

    return <>
        <Button
            disabled={disabled}
            variant="outlined"
            onClick={() => setDialogOpen(true)} >pick frame</Button>

        <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false) }} fullWidth>
            <DialogTitle>
                {title ?? 'pick frame'}
            </DialogTitle>
            <DialogContent>
                <FramePicker forDialog
                    pickFrame={(row, col, imageId) => setLocalFrame({ row, col, imageId })}
                    {...localFrame} />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => setDialogOpen(false)}>cancel</Button>
                <Button variant="contained" onClick={handleSelect}>pick frame</Button>
            </DialogActions>
        </Dialog>
    </>

}