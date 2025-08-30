import { readSoundAssetFromZipFile } from "@/lib/zipFiles";
import { SoundAsset, SoundAssetSchema } from "@/services/assets";
import { AssetManager } from "../asset-components/AssetManager";
import { SoundAssetForm } from "./SoundAssetForm";
import { SoundPreview } from "./SoundPreview";
import { useAssets } from "@/context/asset-context";

export const SoundAssetManager = () => {
    const { soundService } = useAssets()
    return <AssetManager
        assetType='sound'
        service={soundService}
        validateAsset={(a): a is SoundAsset => {
            const parse = SoundAssetSchema.safeParse(a);
            return parse.success
        }}
        FormComponent={SoundAssetForm}
        PreviewComponent={SoundPreview}
        validateZipFile={readSoundAssetFromZipFile}
    />
}