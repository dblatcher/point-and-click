import { SoundValue } from "point-click-lib";
import { Box, BoxProps, IconButton } from "@mui/material";
import { Fragment } from "react";
import { ClearIcon } from "../material-icons";
import { SoundAssetTestButton } from "../SoundAssetTestButton";
import { VolumeControl } from "../VolumeControl";
import { FileAssetSelector } from "../FileAssetSelector";

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


    const renderContents = (sv: SoundValue, index: number) => {
        if (continual) {
            return <Box display={'flex'} flex={1} justifyContent={'space-between'} alignItems={'center'}>
                <FileAssetSelector assetType="sound" format="select"
                    selectedItemId={sv.soundId}
                    legend="continual sound"
                    select={(soundAsset) => editSound(index, { soundId: soundAsset.id })}
                    filterItems={(asset) => asset.category === 'sfx' || asset.category === 'any'}
                    selectNone={()=> handleDeleteSound(index)}
                />
                <VolumeControl value={sv.volume} setValue={(volume) => { editSound(index, { volume }) }} />
                <SoundAssetTestButton soundAssetId={sv.soundId} volume={sv.volume} fontSize="medium" />
                <IconButton color="warning" onClick={() => handleDeleteSound(index)}><ClearIcon /></IconButton>
            </Box>
        }
        return <>
            <Box display={'flex'} flex={1} justifyContent={'space-between'} alignItems={'center'}>
                <FileAssetSelector assetType="sound" format="select"
                    selectedItemId={sv.soundId}
                    legend="sound"
                    select={(soundAsset) => editSound(index, { soundId: soundAsset.id })}
                    filterItems={(asset) => asset.category === 'sfx' || asset.category === 'any'}
                    selectNone={()=> handleDeleteSound(index)}
                />
            </Box>
            <Box display={'flex'} flex={1} justifyContent={'space-between'} alignItems={'center'}>
                <SoundAssetTestButton soundAssetId={sv.soundId} volume={sv.volume} fontSize="medium" />
                <VolumeControl value={sv.volume} setValue={(volume) => { editSound(index, { volume }) }} />
                <IconButton color="warning" onClick={() => handleDeleteSound(index)}><ClearIcon /></IconButton>
            </Box>
        </>
    }

    return <>
        {soundValues.map((sv, index) =>
            <Fragment key={index}>
                {sv.frameIndex === frameIndex && (
                    <Box {...outerBoxProps}>
                        {renderContents(sv, index)}
                    </Box>
                )}
            </Fragment>
        )}
    </>
}