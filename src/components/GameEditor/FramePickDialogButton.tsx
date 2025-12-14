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
    defaultState?: PickerState;
    quickPicking?: boolean;
    noOptions?: boolean;
}


type PickerState = {
    row?: number; col?: number; imageId?: string
}

export const FramePickDialogButton: React.FunctionComponent<Props> = ({
    title = 'pick frame',
    buttonLabel = 'pick frame',
    disabled,
    pickFrame,
    buttonContent,
    buttonProps,
    filterAssets = (item) => item.category === 'spriteSheet' || item.category === 'any',
    showRemoveButton,
    defaultState,
    quickPicking,
    noOptions,
}: Props) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [localFrame, setLocalFrame] = useState(defaultState ?? {})

    const handleSelection = (frame: PickerState) => {
        const { row, col, imageId } = frame
        if (!imageId) {
            return
        }
        if (typeof row === 'undefined' || typeof col === 'undefined') {
            return
        }
        pickFrame(row, col, imageId)
        setDialogOpen(false)
    }

    const remove = () => {
        pickFrame(0, 0, undefined)
        setDialogOpen(false)
    }

    const handleOpen = () => {
        if (defaultState) {
            setLocalFrame(defaultState)
        }
        setDialogOpen(true)
    }

    return <>
        <Button aria-label={buttonLabel}
            variant="outlined"
            {...buttonProps}
            disabled={disabled}
            onClick={handleOpen}
        >{buttonContent ?? buttonLabel}</Button>

        <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false) }} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <FramePicker
                    imageFilter={filterAssets}
                    setLocalFrame={(row, col, imageId) => setLocalFrame({ row, col, imageId })}
                    quickPicking={quickPicking}
                    noOptions={noOptions}
                    handleSelection={handleSelection}
                    currentCol={localFrame.col}
                    currentRow={localFrame.row}
                    imageId={localFrame.imageId}
                    />
            </DialogContent>
            <DialogActions>
                <ButtonGroup variant="contained">
                    <Button variant="outlined" onClick={() => setDialogOpen(false)}>cancel</Button>
                    {showRemoveButton && <Button onClick={remove}>remove</Button>}
                    {!quickPicking &&
                        <Button onClick={() => handleSelection(localFrame)}>pick frame</Button>
                    }
                </ButtonGroup>
            </DialogActions>
        </Dialog>
    </>

}