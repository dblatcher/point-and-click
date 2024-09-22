import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import { FramePicker } from "./SpriteEditor/FramePicker";

interface Props {
    buttonLabel?: string;
    title?: string;
    disabled?: boolean;
    pickFrame: { (row: number, col: number, imageId?: string): void };
}

const defaultState = () => ({ row: 0, col: 0, imageId: undefined })

export const FramePickDialogButton: React.FunctionComponent<Props> = ({
    title = 'pick frame',
    buttonLabel = 'pick frame',
    disabled,
    pickFrame
}: Props) => {
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
            onClick={() => setDialogOpen(true)}
        >{buttonLabel}</Button>

        <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false) }} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <FramePicker forDialog
                    imageFilter={(item)=> {
                        return item.category === 'spriteSheet' || item.category === 'any'
                    }}
                    pickFrame={(row, col, imageId) => setLocalFrame({ row, col, imageId })}
                    {...localFrame} />
            </DialogContent>
            <DialogActions>
                <ButtonGroup>
                    <Button variant="outlined" onClick={() => setDialogOpen(false)}>cancel</Button>
                    <Button variant="contained" onClick={handleSelect}>pick frame</Button>
                </ButtonGroup>
            </DialogActions>
        </Dialog>
    </>

}