import { Service } from "./Service";
import { ImageAsset, getMimeType } from "./assets";


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

    add(items: ImageAsset | ImageAsset[]): void {
        Service.prototype.add.apply(this, [items])

        const itemArray = Array.isArray(items) ? items : [items];
        itemArray.forEach(imageAsset =>
            this.loadImg(imageAsset)
                // .then(() => console.log('loaded image', imageAsset))
                .catch(err => console.error('load image failed', err, imageAsset))
        )
    }

    async loadImg(asset: ImageAsset) {
        const img = document.createElement('img')
        img.src = asset.href

        return new Promise<HTMLImageElement>((resolve, reject) => {
            img.addEventListener('load', () => {
                asset.img = img
                resolve(img)
            })
            img.addEventListener('error', (e) => {
                reject(e)
            })
        })
    }
}
