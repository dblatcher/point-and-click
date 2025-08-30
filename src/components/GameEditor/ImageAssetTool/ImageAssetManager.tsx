import { readImageAssetFromZipFile } from "@/lib/zipFiles";
import { ImageAsset, ImageAssetSchema } from "@/services/assets";
import { AssetManager } from "../asset-components/AssetManager";
import { ImageAssetForm } from "./ImageAssetForm";
import { ImageAssetPreview } from "./ImageAssetPreview";
import { useAssets } from "@/context/asset-context";

export const ImageAssetManager = () => {
    const { imageService } = useAssets();
    return <AssetManager
        assetType='image'
        service={imageService}
        validateAsset={(a): a is ImageAsset => {
            const parse = ImageAssetSchema.safeParse(a);
            return parse.success
        }}
        FormComponent={ImageAssetForm}
        PreviewComponent={ImageAssetPreview}
        validateZipFile={readImageAssetFromZipFile}
    />
}