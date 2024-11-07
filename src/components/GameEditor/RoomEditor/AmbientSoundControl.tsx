import { useAssets } from "@/context/asset-context";
import { AmbientSound } from "@/definitions/RoomData";
import { Alert, Box } from "@mui/material";
import React from "react";
import { EditorBox } from "../EditorBox";
import { FileAssetSelector } from "../FileAssetSelector";
import { VolumeControl } from "../VolumeControl";

interface Props {
    label: string
    value?: AmbientSound
    setValue: { (value?: AmbientSound): void }
}

export const AmbientSoundControl: React.FunctionComponent<Props> = ({ label, value, setValue }) => {
    const { soundService } = useAssets()
    const asset = value ? soundService.get(value.soundId) : undefined
    const soundIdIsInvalid = !!value && !asset;

    return <EditorBox title={label} contentBoxProps={{ display: 'flex', gap: 2 }}>
        <Box>
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

        <Box display={'flex'} alignItems={'center'}>
            {soundIdIsInvalid && (
                <Alert severity="error">No sound asset {value.soundId}</Alert>
            )}

            {asset && (
                <audio
                    onVolumeChange={({ target }) => {
                        if (target instanceof HTMLAudioElement && value) {
                            setValue({ ...value, volume: target.volume ?? 0 })
                        }
                    }}
                    controls src={asset.href} controlsList="nodownload noplaybackrate"></audio>
            )}
        </Box>
    </EditorBox>
}