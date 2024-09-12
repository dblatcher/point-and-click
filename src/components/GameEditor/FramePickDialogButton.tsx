import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React, { useState } from "react";
import { FramePicker } from "./SpriteEditor/FramePicker";

interface Props {
    disabled?: boolean;
    row: number;
    col: number;
    imageId?: string;
    pickFrame: { (row: number, col: number, imageId?: string): void };
    fixedSheet?: boolean;
    noOptions?: boolean;
}

// TO DO - don't call pick frame until the user confirms
export const FrameePickDialogButton: React.FunctionComponent<Props> = ({disabled, ...rest }: Props) => {

    const [dialogOpen, setDialogOpen] = useState(false)

    return <>
        <Button
            disabled={disabled}
            variant="outlined"
            onClick={() => setDialogOpen(true)} >pick frame</Button>

        <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false) }}>

            <DialogContent>
                <FramePicker {...rest} />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>close</Button>
            </DialogActions>
        </Dialog>
    </>

}