import { fileToObjectUrl } from "@/lib/files";
import { FileAsset } from "./assets";

export const setHrefsFromFiles = <FileAssetType extends FileAsset>(assetsAndFiles: {
    asset: FileAssetType;
    file: File;
}[]) => {

    return assetsAndFiles.map(({ asset, file }) => {
        const objectUrl = fileToObjectUrl(file)
        if (!objectUrl) {
            console.error('failed to get object URL', asset, file)
            return { ...asset }
        }
        return { ...asset, href: objectUrl };
    })
}