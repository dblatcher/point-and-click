import { Service } from "./Service";
import { ImageAsset, getImageMimeType } from "./assets";


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
            return new File([blob], asset.id, { type: getImageMimeType(asset) })
        } catch (err) {
            console.warn(err)
            return undefined
        }
    }
}

const imageService = new ImageService()

export default imageService;
