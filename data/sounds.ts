import type { SoundAsset } from "../src/services/soundService"

const testSoundAsset: SoundAsset = {
    id: 'beep',
    href: './assets/beep.mp3',
    category: 'sfx',
}

export const soundAssets: SoundAsset[] = [
    testSoundAsset
]
