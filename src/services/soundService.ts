import { SoundControl, SoundDeck } from "physics-worlds";
import Zod, { object, string } from "zod";
import { Service } from "./Service";


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

function getFileExtension(asset: SoundAsset): string | undefined {
    const { href, originalFileName } = asset
    const fileName = originalFileName || href
    return fileName.includes(".") ? fileName.split(".").reverse()[0] : undefined
}
function getMimeType(asset: SoundAsset): string | undefined {
    const fileExtension = getFileExtension(asset)
    return fileExtension ? `sound/${fileExtension}` : undefined
}


export class SoundService extends Service<SoundAsset> {
    private soundDeck: SoundDeck

    constructor() {
        super()
        this.soundDeck = new SoundDeck()
    }

    add(items: SoundAsset | SoundAsset[]): void {
        Service.prototype.add.apply(this, [items])

        const itemArray = Array.isArray(items) ? items : [items];

        itemArray.forEach(soundAsset => {
            this.soundDeck.defineSampleBuffer(soundAsset.id, soundAsset.href)
                .then(r => { console.log('sample buffer', r, soundAsset.id) })
        })
    }

    play(soundId: string, playOptions?: {
        volume?: number;
        loop?: boolean;
    }): SoundControl | null {
        const asset = this.get(soundId)
        if (!asset) { return null }
        return this.soundDeck.playSample(asset.id, playOptions)
    }

    enable(): Promise<void> {
        return this.soundDeck.enable()
    }

    disable(): Promise<void> {
        return this.soundDeck.disable()
    }

    get isEnabled(): boolean {
        return this.soundDeck.isEnabled
    }

    listHref(): string[] {
        return Object.values(this.data)
            .filter(asset => typeof asset !== 'undefined')
            .map(asset => (asset as SoundAsset).href)
    }

    getAll(): Readonly<SoundAsset>[] {
        return Object.values(this.data)
            .filter(asset => typeof asset !== 'undefined')
            .map(asset => (asset as Readonly<SoundAsset>))
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

const soundService = new SoundService()

export default soundService;
