import { Service } from "./Service";

export type ImageAssetCategory = 'background'

export const imageAssetCategories: ImageAssetCategory[] = ['background']

export type ImageAsset = {
    id: string;
    href: string;
    category: ImageAssetCategory;
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
}

const imageService = new ImageService()

export default imageService;
