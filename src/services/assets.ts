import Zod, { object, string, number } from "zod";

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



export type SoundAssetCategory = 'sfx'
export type SoundAsset = {
    id: string;
    href: string;
    category: SoundAssetCategory;
    originalFileName?: string;
}

export const SoundAssetSchema = object({
    id: string(),
    href: string(),
    category: Zod.enum(['sfx']),
    originalFileName: string().optional(),
})

export const soundAssetCategories: SoundAssetCategory[] = SoundAssetSchema.shape.category.options.map(_ => _)

function getFileExtension(asset: ImageAsset | SoundAsset): string | undefined {
    const { href, originalFileName } = asset
    const fileName = originalFileName || href
    return fileName.includes(".") ? fileName.split(".").reverse()[0] : undefined
}
export function getImageMimeType(asset: ImageAsset): string | undefined {
    const fileExtension = getFileExtension(asset)
    return fileExtension ? `image/${fileExtension}` : undefined
}
export function getSoundMimeType(asset: SoundAsset): string | undefined {
    const fileExtension = getFileExtension(asset)
    return fileExtension ? `sound/${fileExtension}` : undefined
}

