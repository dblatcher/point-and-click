import { ActorData } from "@/definitions";
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from "@mui/material";
import React, { useState } from "react";
import { SpritePreview } from "../SpritePreview";
import { FramePickDialogButton } from "../FramePickDialogButton";
import { StaticFrameParamsS } from "@/definitions/BaseTypes";
import { cloneData } from "@/lib/clone";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { formatIdInput } from "../helpers";

interface Props {
    actorData: ActorData;
    buttonLabel?: string;
    title?: string;
    disabled?: boolean;
    changeStatusFrames: { (statusFrames: ActorData['statusFrames']): void }
}


export const StatusFramesDialogButton: React.FunctionComponent<Props> = ({
    title = 'Status Frames',
    buttonLabel = 'Set Status Frames',
    disabled,
    actorData,
    changeStatusFrames,
}: Props) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [newStatusName, setNewStatusName] = useState('')

    const { statusFrames = {} } = actorData

    const handleChangeFrame = (status: string, frame: StaticFrameParamsS) => {
        changeStatusFrames({ ...statusFrames, [status]: frame })
    }
    const handleDeleteFrame = (status: string) => {
        const copy = cloneData(statusFrames)
        delete copy[status]
        changeStatusFrames(copy)
    }

    const newStatusIsOkay = newStatusName.length > 0 && newStatusName.toLowerCase() !== 'default' && !Object.keys(statusFrames).includes(newStatusName)

    return <>
        <Button
            disabled={disabled}
            variant="outlined"
            onClick={() => setDialogOpen(true)}
        >{buttonLabel}</Button>

        <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false) }} fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>

                <Box display={'flex'} alignItems={'center'}>
                    <Typography>default frame</Typography>
                    <SpritePreview data={actorData} noBaseLine maxHeight={80} animation="default" />
                </Box>

                {Object.keys(statusFrames).map((status) => (
                    <Box key={status} display={'flex'} alignItems={'center'} padding={1} marginBottom={2} gap={5}>
                        <Typography marginRight={'auto'}>{status}</Typography>
                        <FramePickDialogButton
                            buttonLabel="change"
                            pickFrame={(row, col, imageId) => {
                                if (imageId) {
                                    handleChangeFrame(status, { row, col, imageId })
                                } else {
                                    handleDeleteFrame(status)
                                }
                            }}
                            defaultState={actorData.statusFrames?.[status]}
                            showRemoveButton
                            buttonContent={
                                <Box>
                                    <SpritePreview animation={status} data={actorData} noBaseLine maxHeight={80} />
                                </Box>
                            }
                        />
                        <Button variant="outlined" color={'warning'} onClick={() => { handleDeleteFrame(status) }}>delete</Button>
                    </Box>
                ))}

                <Box display={'flex'} gap={5}>
                    <StringInput label="add new"
                        value={newStatusName}
                        inputHandler={(value) => setNewStatusName(formatIdInput(value))} />

                    <FramePickDialogButton
                        buttonLabel="pick"
                        disabled={!newStatusIsOkay}
                        pickFrame={(row, col, imageId) => {
                            if (imageId) {
                                handleChangeFrame(newStatusName, { row, col, imageId })
                            }
                        }}
                    />

                </Box>
            </DialogContent>
            <DialogActions>
                <ButtonGroup>
                    <Button variant="outlined" onClick={() => setDialogOpen(false)}>done</Button>
                </ButtonGroup>
            </DialogActions>
        </Dialog>
    </>

}