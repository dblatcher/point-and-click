import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React, { useState } from "react";
import { FramePicker } from "./SpriteEditor/FramePicker";

interface Props {
    disabled?: boolean;
    pickFrame: { (row: number, col: number, imageId?: string): void };
}

const defaultState = () => ({ row: 0, col: 0, imageId: undefined })

// TO DO - don't call pick frame until the user confirms
export const FrameePickDialogButton: React.FunctionComponent<Props> = ({ disabled, pickFrame }: Props) => {
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

        <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false) }}>
            <DialogContent>
                <FramePicker
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