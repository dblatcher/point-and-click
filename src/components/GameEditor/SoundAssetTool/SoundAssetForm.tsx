import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import {
    SoundAsset, soundAssetCategories,
    SoundAssetCategory
} from "@/services/assets";
import { Stack } from "@mui/material";
import { EditorBox } from "../EditorBox";

interface Props {
    asset: Partial<SoundAsset>;
    changeValue: { (mod: Partial<SoundAsset>): void }
    hasFile: boolean;
}


export const SoundAssetForm = ({ asset: soundAsset, changeValue, hasFile }: Props) => {
    return (
        <EditorBox title="Asset Properties" boxProps={{ marginBottom: 1 }}>
            <Stack spacing={2}>
                <StringInput
                    value={soundAsset.id ?? ''}
                    label="ID"
                    inputHandler={(value) => { changeValue({ 'id': value }) }}
                />
                <SelectInput optional
                    value={soundAsset.category}
                    label="category"
                    inputHandler={(value) => { changeValue({ 'category': value as SoundAssetCategory | undefined }) }}
                    options={soundAssetCategories}
                />
            </Stack>
        </EditorBox>
    )
}