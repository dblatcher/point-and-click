import Zod, { object, string, number } from "zod";
import { Service } from "./Service";

export type ImageAssetCategory = 'background' | 'item' | 'spriteSheet' | 'any'

export const imageAssetCategories: ImageAssetCategory[] = ['background', 'item', 'spriteSheet', 'any']

export type ImageAsset = {
    id: string;
    href: string;
    category: ImageAssetCategory;
    originalFileName?: string;

    rows?: number;
    cols?: number;
    widthScale?: number;
    heightScale?: number;
}

export const ImageAssetSchema = object({
    id: string(),
    href: string(),
    category: Zod.enum(['background', 'item', 'spriteSheet', 'any']),
    originalFileName: string().optional(),

    rows: number().optional(),
    cols: number().optional(),
    widthScale: number().optional(),
    heightScale: number().optional(),
})

function getFileExtension(asset: ImageAsset): string | undefined {
    const { href, originalFileName } = asset
    const fileName = originalFileName || href
    return fileName.includes(".") ? fileName.split(".").reverse()[0] : undefined
}
function getMimeType(asset: ImageAsset): string | undefined {
    const fileExtension = getFileExtension(asset)
    return fileExtension ? `image/${fileExtension}` : undefined
}


export class ImageService extends Service<ImageAsset> {

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
            return new File([blob], asset.id, { type: getMimeType(asset) })
        } catch (err) {
            console.warn(err)
            return undefined
        }
    }
}

const imageService = new ImageService()

export default imageService;