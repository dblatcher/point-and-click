import { SoundControl, SoundDeck } from "sound-deck";
import { Service } from "./Service";
import { SoundAsset, getMimeType } from "./assets";



export class SoundService extends Service<SoundAsset> {
    private soundDeck?: SoundDeck

    constructor() {
        super()
        if (typeof window !== 'undefined') {
            this.soundDeck = new SoundDeck()
        }
        this.setMaxListeners(20)
    }

    add(items: SoundAsset | SoundAsset[]): void {
        Service.prototype.add.apply(this, [items])

        const itemArray = Array.isArray(items) ? items : [items];
        itemArray.forEach(soundAsset =>
            this.soundDeck?.defineSampleBuffer(soundAsset.id, soundAsset.href)
                .then(success => {
                    console.log('soundService: load', soundAsset.id, success)
                    this.emit('load', soundAsset.id, success)
                })
        )
    }

    play(soundId: string, playOptions?: {
        volume?: number;
        loop?: boolean;
    }): SoundControl | null {
        const asset = this.get(soundId)
        if (!asset || !this.soundDeck) { return null }
        return this.soundDeck.playSample(asset.id, playOptions)
    }

    enable(): Promise<void> {
        if (!this.soundDeck) { return Promise.resolve() }
        return this.soundDeck.enable()
            .then(() => {
                this.emit('ready', this.isEnabled)
            })
    }

    disable(): Promise<void> {
        if (!this.soundDeck) { return Promise.resolve() }
        return this.soundDeck.disable()
            .then(() => {
                this.emit('ready', this.isEnabled)
            })
    }

    get isEnabled(): boolean {
        return this.soundDeck?.isEnabled || false
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
