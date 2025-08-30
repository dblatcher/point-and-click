import { ImageAsset, SoundAsset } from '@/services/assets'
import { ImageService } from '@/services/imageService'
import { SoundService } from '@/services/soundService';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'


export type AssetContextProps = {
    getImageAsset(id: string): ImageAsset | undefined;
    removeImageAsset(id: string): void;
    imageAssets: ImageAsset[];
    imageService: ImageService;

    removeSoundAsset(id: string): void;
    soundService: SoundService;
    soundAssets: SoundAsset[];
}
const AssetContext = createContext<AssetContextProps>({
    getImageAsset() {
        return undefined
    },
    removeImageAsset() {
        return undefined
    },
    imageAssets: [],
    imageService: new ImageService(),
    removeSoundAsset() {
        return undefined
    },
    soundAssets: [],
    soundService: new SoundService(),
})

type AssetsProviderProps = {
    children: ReactNode;
    imageService: ImageService;
    soundService: SoundService;
}

export const AssetsProvider = ({ children, imageService, soundService }: AssetsProviderProps) => {

    const [imageAssets, setImageAssets] = useState(imageService.getAll())
    const [soundAssets, setSoundAssets] = useState(soundService.getAll())
    useEffect(() => {
        const refresh = () => {
            setImageAssets(imageService.getAll())
        }
        imageService.on('update', refresh)
        return () => {
            imageService.off('update', refresh)
        }
    })
    useEffect(() => {
        const refresh = () => {
            setSoundAssets(soundService.getAll())
        }
        soundService.on('update', refresh)
        return () => {
            soundService.off('update', refresh)
        }
    })

    return <AssetContext.Provider
        value={{
            getImageAsset(id) {
                return imageService.get(id)
            },
            removeImageAsset(id) {
                return imageService.remove(id)
            },
            imageAssets,
            imageService,
            removeSoundAsset(id) {
                return soundService.remove(id)
            },
            soundService,
            soundAssets,
        }}
    >
        {children}
    </AssetContext.Provider>
}

export const useAssets = () => {
    return useContext(AssetContext)
}