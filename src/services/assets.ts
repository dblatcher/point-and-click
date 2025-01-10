import { AspectRatio } from "@/definitions/BaseTypes";
import Zod, { object, string, number } from "zod";

export type FileAsset = {
    id: string;
    href: string;
    originalFileName?: string;
    category?: string;
}


export type ImageAssetCategory = 'background' | 'item' | 'spriteSheet' | 'any'
export type ImageAsset = FileAsset & {
    category: ImageAssetCategory;
    rows?: number;
    cols?: number;
    widthScale?: number;
    heightScale?: number;
    img?: HTMLImageElement;
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
export const imageAssetCategories: ImageAssetCategory[] = ['background', 'item', 'spriteSheet', 'any']

export type SoundAssetCategory = 'sfx' | 'music'
export type SoundAsset = FileAsset & {
    category: SoundAssetCategory;
}
export const SoundAssetSchema = object({
    id: string(),
    href: string(),
    category: Zod.enum(['sfx', 'music']),
    originalFileName: string().optional(),
})
export const soundAssetCategories: SoundAssetCategory[] = SoundAssetSchema.shape.category.options.map(_ => _)


export const isSoundAsset = (asset: FileAsset): asset is SoundAsset => (soundAssetCategories as (string | undefined)[]).includes(asset.category)


function getFileExtension(asset: FileAsset): string | undefined {
    const { href, originalFileName } = asset
    const fileName = originalFileName || href
    return fileName.includes(".") ? fileName.split(".").reverse()[0] : undefined
}


export function getMimeType(asset: FileAsset): string | undefined {
    const fileExtension = getFileExtension(asset)
    if (isSoundAsset(asset)) {
        return fileExtension ? `sound/${fileExtension}` : undefined
    }
    return fileExtension ? `image/${fileExtension}` : undefined
}

export const getFrameDims = (asset: ImageAsset): AspectRatio | undefined => {
    if (!asset.img) {
        return undefined
    }
    const frameDims = {
        x: (asset.img.naturalWidth / (asset.cols ?? 1)),
        y: (asset.img.naturalHeight / (asset.rows ?? 1)),
    }
    return frameDims
}
