import { useAssets } from "@/context/asset-context";
import { SoundInstance } from "point-click-lib";
import { Alert, Box, Typography } from "@mui/material";
import React from "react";
import { FileAssetSelector } from "../FileAssetSelector";
import { VolumeControl } from "../VolumeControl";

interface Props {
    label: string
    value?: SoundInstance
    setValue: { (value?: SoundInstance): void }
}

export const AmbientSoundControl: React.FunctionComponent<Props> = ({ label, value, setValue }) => {
    const { soundService } = useAssets()
    const asset = value ? soundService.get(value.soundId) : undefined
    const soundIdIsInvalid = !!value && !asset;

    return <Box marginBottom={3}>
        <Box display={'flex'} gap={2} alignItems={'center'} flexWrap={'wrap'}>
            <Typography minWidth={120} fontWeight={'bold'}>{label}</Typography>
            <FileAssetSelector legend="sound Id" format="select"
                assetType="sound"
                filterItems={(item) => item.category === 'music'}
                selectedItemId={value?.soundId}
                selectNone={() => {
                    setValue(undefined)
                }}
                select={(item) => {
                    setValue({ ...value, soundId: item.id })
                }}
            />
            <VolumeControl value={value?.volume}
                disabled={!value}
                setValue={(number) => {
                    if (value) {
                        setValue({ ...value, volume: number })
                    }
                }} />
        </Box>
        {soundIdIsInvalid && (
            <Alert severity="error">No sound asset {value.soundId}</Alert>
        )}
        <audio style={{ maxHeight: 40 }} key={asset?.href}
            onVolumeChange={({ target }) => {
                if (target instanceof HTMLAudioElement && value) {
                    setValue({ ...value, volume: target.volume ?? 0 })
                }
            }}
            controls
            src={value ? asset?.href : undefined}
            controlsList="nodownload noplaybackrate" />
    </Box>
}