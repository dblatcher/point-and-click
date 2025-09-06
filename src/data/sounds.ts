import type { SoundAsset } from "@/services/assets"

export const soundAssets: SoundAsset[] = [
    {
        id: 'beep',
        href: './assets/sounds/beep.mp3',
        originalFileName: 'beep.mp3',
        category: 'sfx',
    },
    {
        id: 'fire',
        href: './assets/sounds/fire.mp3',
        originalFileName: 'fire.mp3',
        category: 'sfx',
    },
    {
        id: 'footstep-1',
        href: './assets/sounds/sfx100v2_footstep_wood_01.ogg',
        originalFileName: 'sfx100v2_footstep_wood_01.ogg',
        category: 'sfx',
    },
    {
        id: 'footstep-2',
        href: './assets/sounds/sfx100v2_footstep_wood_04.ogg',
        originalFileName: 'sfx100v2_footstep_wood_04.ogg',
        category: 'sfx',
    },
    {
        id: 'sparrows',
        href: './assets/sounds/birds-short.mp3',
        originalFileName: 'birds-short.mp3',
        category: 'music',
    },
]
