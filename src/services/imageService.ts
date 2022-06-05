export type ImageAsset = {
    id: string;
    href: string;
    category: 'spritesheet' | 'background';
}

class ImageService {
    protected data: Record<string, ImageAsset | undefined>

    constructor() {
        this.data = {}
    }

    add(imageAssets: ImageAsset | ImageAsset[]): void {
        if (!Array.isArray(imageAssets)) {
            imageAssets = [imageAssets]
        }
        imageAssets.forEach(imageAsset => this.data[imageAsset.id] = imageAsset)
    }

    get(id: string): ImageAsset | undefined {
        return this.data[id]
    }

    list(): string[] {
        return Object.keys(this.data)
    }

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
