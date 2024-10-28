import { ImageAsset } from '@/services/assets'
import { ImageService } from '@/services/imageService'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'


type AssetContextProps = {
    getAsset(id: string): ImageAsset | undefined;
    removeImageAsset(id: string): void;
    imageAssets: ImageAsset[];
    imageService: ImageService;
}
const AssetContext = createContext<AssetContextProps>({
    getAsset() {
        return undefined
    },
    removeImageAsset() {
        return undefined
    },
    imageAssets: [],
    imageService: new ImageService()
})

type AssetsProviderProps = {
    children: ReactNode,
    imageService: ImageService
}

export const AssetsProvider = ({ children, imageService }: AssetsProviderProps) => {

    const [imageAssets, setImageAssets] = useState(imageService.getAll())

    useEffect(() => {
        const refresh = (length: number) => {
            console.log('images in context', length)
            setImageAssets(imageService.getAll())
        }
        imageService.on('update', refresh)
        return () => {
            imageService.off('update', refresh)
        }
    })

    return <AssetContext.Provider
        value={{
            getAsset(id) {
                return imageService.get(id)
            },
            removeImageAsset(id) {
                return imageService.remove(id)
            },
            imageAssets,
            imageService,
        }}
    >
        {children}
    </AssetContext.Provider>
}

export const useAssets = () => {
    return useContext(AssetContext)
}