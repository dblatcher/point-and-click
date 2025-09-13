import { SoundControl, SoundDeck } from "sound-deck";
import { FileAssetService } from "./FileAssetService";
import { SoundAsset } from "./assets";


export class SoundService extends FileAssetService<SoundAsset> {
    private soundDeck?: SoundDeck

    constructor() {
        super()
        if (typeof window !== 'undefined') {
            this.soundDeck = new SoundDeck()
        }
        this.setMaxListeners(20)
    }

    protected postAdd(items: SoundAsset[]): Promise<void> {
        return Promise.all(
            items.map(soundAsset =>
                this.soundDeck?.defineSampleBuffer(soundAsset.id, soundAsset.href)
                    .then(success => {
                        this.emit('load', soundAsset.id, success)
                    }))
        ).then(() => { })
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

    getAll(): Readonly<SoundAsset>[] {
        return Object.values(this.data)
            .filter(asset => typeof asset !== 'undefined')
            .map(asset => (asset as Readonly<SoundAsset>))
    }
}

