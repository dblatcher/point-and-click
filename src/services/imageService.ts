import { FileAssetService, UpdateSource } from "./FileAssetService";
import { ImageAsset } from "./assets";


export class ImageService extends FileAssetService<ImageAsset> {

    getAll(): Readonly<ImageAsset>[] {
        return Object.values(this.data)
            .filter(asset => typeof asset !== 'undefined')
            .map(asset => (asset as Readonly<ImageAsset>))
    }

    protected postAdd(items: ImageAsset[]): void {
        items.forEach(imageAsset =>
            this.loadImg(imageAsset)
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
