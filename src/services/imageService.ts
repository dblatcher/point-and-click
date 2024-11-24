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

    async getNaturalDims(id: string): Promise<{ naturalHeight?: number, naturalWidth?: number }> {
        const asset = this.get(id)
        if (!asset) {
            return {}
        }
        const img = document.createElement('img')

        return new Promise<HTMLImageElement>((resolve, reject) => {
            img.addEventListener('load', () => {
                resolve(img)
            })
            img.addEventListener('error', (e) => {
                reject(e)
            })
        }).then(img => ({ naturalHeight: img.naturalHeight, naturalWidth: img.naturalWidth }))
            .catch(err => {
                console.warn('failed to get natural dims', err)
                return {}
            })
    }
}
