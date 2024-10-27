import { ImageAsset } from '@/services/assets'
import { ImageService } from '@/services/imageService'
import { createContext, ReactNode, useContext } from 'react'


type ImageAssetContextProps = {
    getAsset(id: string): ImageAsset | undefined;
    listIds(): string[];
    getAllAssets(): ImageAsset[];
}
const ImageAssetContext = createContext<ImageAssetContextProps>({
    getAsset() {
        return undefined
    },
    listIds() {
        return []
    },
    getAllAssets() {
        return []
    }
})

type ImageAssetsProviderProps = {
    children: ReactNode,
    imageService: ImageService
}

export const ImageAssetsProvider = ({ children, imageService }: ImageAssetsProviderProps) => {

    return <ImageAssetContext.Provider
        value={{
            getAsset(id) {
                return imageService.get(id)
            },
            listIds() {
                return imageService.list()
            },
            getAllAssets() {
                return imageService.getAll()
            },
        }}
    >
        {children}
    </ImageAssetContext.Provider>
}

export const useImageAssets = () => {
    return useContext(ImageAssetContext)
}