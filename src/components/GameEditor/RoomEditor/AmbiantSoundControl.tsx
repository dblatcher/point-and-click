import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { AmbiantSound } from "@/definitions/RoomData";
import { Alert, Box } from "@mui/material";
import React from "react";
import { EditorBox } from "../EditorBox";
import { FileAssetSelector } from "../FileAssetSelector";
import { useAssets } from "@/context/asset-context";

interface Props {
    label: string
    value?: AmbiantSound
    setValue: { (value?: AmbiantSound): void }
}

export const AmbiantSoundControl: React.FunctionComponent<Props> = ({ label, value, setValue }) => {
    const { soundService } = useAssets()
    const asset = value ? soundService.get(value.soundId) : undefined

    const soundIdIsInvalid = !!value && !asset;
    // TO DO - generalised volume control component
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


            <NumberInput
                label="volume"
                readOnly={!value}
                value={value?.volume || 1}
                max={1} min={0} step={.1}
                inputHandler={(number) => {
                    if (value) {
                        setValue({ ...value, volume: number })
                    }
                }}
            />
        </Box>


        {soundIdIsInvalid && (
            <Alert severity="error">No sound asset {value.soundId}</Alert>
        )}

        {asset && (
            <audio controls src={asset.href}></audio>
        )}
    </EditorBox>
}