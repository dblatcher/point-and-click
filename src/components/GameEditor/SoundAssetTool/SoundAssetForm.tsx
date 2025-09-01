import { SelectInput } from "@/components/SchemaForm/SelectInput";
import {
    SoundAsset, soundAssetCategories,
    SoundAssetCategory
} from "@/services/assets";

interface Props {
    asset: Partial<SoundAsset>;
    changeValue: { (mod: Partial<SoundAsset>): void }
}


export const SoundAssetForm = ({ asset: soundAsset, changeValue }: Props) => {
    return (
        <SelectInput optional
            value={soundAsset.category}
            label="category"
            inputHandler={(value) => { changeValue({ 'category': value as SoundAssetCategory | undefined }) }}
            options={soundAssetCategories}
        />
    )
}