import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { AmbiantSound } from "@/definitions/RoomData";
import { Alert, Box } from "@mui/material";
import React from "react";
import { EditorBox } from "../EditorBox";
import { FileAssetSelector } from "../FileAssetSelector";
import { useAssets } from "@/context/asset-context";
import { VolumeControl } from "../VolumeControl";

interface Props {
    label: string
    value?: AmbiantSound
    setValue: { (value?: AmbiantSound): void }
}

export const AmbiantSoundControl: React.FunctionComponent<Props> = ({ label, value, setValue }) => {
    const { soundService } = useAssets()
    const asset = value ? soundService.get(value.soundId) : undefined

    const soundIdIsInvalid = !!value && !asset;
    return <EditorBox title={label} contentBoxProps={{ display: 'flex' }}>
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

        {soundIdIsInvalid && (
            <Alert severity="error">No sound asset {value.soundId}</Alert>
        )}

        {asset && (
            <audio controls src={asset.href}></audio>
        )}
    </EditorBox>
}