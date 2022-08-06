import { Service } from "./Service";

export type ImageAssetCategory = 'background' | 'item' | 'spriteSheet'

export const imageAssetCategories: ImageAssetCategory[] = ['background', 'item', 'spriteSheet']

export type ImageAsset = {
    id: string;
    href: string;
    category: ImageAssetCategory;
    originalFileName?: string;
}

function getFileExtension(asset: ImageAsset): string | undefined {
    const { href, originalFileName } = asset
    const fileName = originalFileName || href
    return fileName.includes(".") ? fileName.split(".").reverse()[0] : undefined
}
function getMimeType(asset: ImageAsset): string | undefined {
    const fileExtension = getFileExtension(asset)
    return fileExtension ? `image/${fileExtension}` : undefined
}
function getFileName(asset: ImageAsset): string {
    const { id } = asset
    const fileExtension = getFileExtension(asset)
    if (!fileExtension) { return id }
    const fileExtensionWithDot = `.${fileExtension}`

    if (id.endsWith(fileExtensionWithDot)) {
        return id
    }
    return id + fileExtensionWithDot
}

class ImageService extends Service<ImageAsset> {

    listHref(): string[] {
        return Object.values(this.data)
            .filter(asset => typeof asset !== 'undefined')
            .map(asset => (asset as ImageAsset).href)
    }

    getAll(): Readonly<ImageAsset>[] {
        return Object.values(this.data)
            .filter(asset => typeof asset !== 'undefined')
            .map(asset => (asset as Readonly<ImageAsset>))
    }

    getFile = async (id: string): Promise<File | undefined> => {
        const asset = this.get(id)
        if (!asset) { return undefined }
        try {
            const response = await fetch(asset.href)
            const blob = await response.blob()
            return new File([blob], getFileName(asset), { type: getMimeType(asset) })
        } catch (err) {
            console.warn(err)
            return undefined
        }
    }
}

const imageService = new ImageService()

export default imageService;
