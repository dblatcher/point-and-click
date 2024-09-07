import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { SoundValue } from "@/definitions";
import { Box, BoxProps, IconButton, Typography } from "@mui/material";
import { Fragment } from "react";
import { ClearIcon } from "../material-icons";
import { SoundAssetTestButton } from "../SoundAssetTestButton";

interface Props {
    soundValues: SoundValue[],
    frameIndex: number | undefined
    handleDeleteSound: { (index: number): void }
    editSound: { (index: number, mod: Partial<SoundValue>): void }
    continual?: boolean
}

export const SoundBoxes = ({
    soundValues,
    frameIndex,
    handleDeleteSound,
    editSound,
    continual,
}: Props) => {
    const outerBoxProps: BoxProps = {
        width: '100%',
        sx: {
            borderWidth: 1,
            borderLeftWidth: continual ? 1 : 0,
            borderRightWidth: continual ? 1 : 0,
            borderColor: 'primary.dark',
            borderStyle: 'solid',
            boxSizing: 'border-box',
        },
        ...continual ? {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginY: 3,
        } : {}
    }
    return <>
        {soundValues.map((sv, index) =>
            <Fragment key={index}>
                {sv.frameIndex === frameIndex && (
                    <Box {...outerBoxProps}>
                        {continual && <Typography variant="caption">CONTINUAL:</Typography>}
                        <Box display={'flex'} flex={1} justifyContent={'space-between'} alignItems={'center'}>
                            <Typography>{sv.soundId}</Typography>
                            <NumberInput label="volume"
                                notFullWidth
                                inputHandler={(volume) => { editSound(index, { volume }) }}
                                value={sv.volume ?? 1}
                                max={1} min={0} step={.1} />
                        </Box>
                        <Box display={'flex'} flex={1} justifyContent={'space-between'} alignItems={'center'}>
                            <SoundAssetTestButton soundAssetId={sv.soundId} volume={sv.volume} fontSize="medium" />
                            <IconButton color="warning" onClick={() => handleDeleteSound(index)}><ClearIcon /></IconButton>
                        </Box>
                    </Box>
                )}
            </Fragment>
        )}
    </>
}