import { readSoundAssetFromZipFile } from "@/lib/zipFiles";
import { SoundAsset, SoundAssetSchema } from "@/services/assets";
import { AssetManager } from "../asset-components/AssetManager";
import { SoundAssetForm } from "./SoundAssetForm";
import { SoundPreview } from "./SoundPreview";

export const SoundAssetManager = () => <AssetManager
    assetType='sound'
    validateAsset={(a): a is SoundAsset => {
        const parse = SoundAssetSchema.safeParse(a);
        return parse.success
    }}
    FormComponent={SoundAssetForm}
    PreviewComponent={SoundPreview}
    validateZipFile={readSoundAssetFromZipFile}
/>