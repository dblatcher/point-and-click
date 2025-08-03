import { Button, ButtonGroup, ButtonProps, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React, { ReactNode, useState } from "react";
import { FramePicker } from "./FramePicker";
import { FileAsset } from "@/services/assets";

interface Props {
    buttonContent?: ReactNode;
    buttonLabel?: string;
    title?: string;
    disabled?: boolean;
    pickFrame: { (row: number, col: number, imageId?: string): void };
    buttonProps?: ButtonProps
    filterAssets?: { (asset: FileAsset): boolean }
    showRemoveButton?: boolean;
}

const defaultState = () => ({ row: 0, col: 0, imageId: undefined })

export const FramePickDialogButton: React.FunctionComponent<Props> = ({
    title = 'pick frame',
    buttonLabel = 'pick frame',
    disabled,
    pickFrame,
    buttonContent,
    buttonProps,
    filterAssets = (item) => item.category === 'spriteSheet' || item.category === 'any',
    showRemoveButton
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

    const remove = () => {
        pickFrame(0, 0, undefined)
        setDialogOpen(false)
    }

    return <>
        <Button aria-label={buttonLabel}
            variant="outlined"
            {...buttonProps}
            disabled={disabled}
            onClick={() => setDialogOpen(true)}
        >{buttonContent ?? buttonLabel}</Button>

        <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false) }} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <FramePicker forDialog
                    imageFilter={filterAssets}
                    pickFrame={(row, col, imageId) => setLocalFrame({ row, col, imageId })}
                    {...localFrame} />
            </DialogContent>
            <DialogActions>
                <ButtonGroup  variant="contained">
                    <Button variant="outlined" onClick={() => setDialogOpen(false)}>cancel</Button>
                    {showRemoveButton && <Button onClick={remove}>remove</Button>}
                    <Button onClick={handleSelect}>pick frame</Button>
                </ButtonGroup>
            </DialogActions>
        </Dialog>
    </>

}