import { TypedEmitter } from "tiny-typed-emitter";

export type ImageAsset = {
    id: string;
    href: string;
    category: 'spritesheet' | 'background';
}

interface ServiceEvents {
    'update': (length: number) => void;
}

class ImageService extends TypedEmitter<ServiceEvents> {
    protected data: Record<string, ImageAsset | undefined>

    constructor() {
        super()
        this.data = {}
    }

    reportUpdate(): void {
        this.emit('update', this.list().length)
    }

    add(imageAssets: ImageAsset | ImageAsset[]): void {
        if (!Array.isArray(imageAssets)) {
            imageAssets = [imageAssets]
        }
        imageAssets.forEach(imageAsset => this.data[imageAsset.id] = imageAsset)
        this.reportUpdate()
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
