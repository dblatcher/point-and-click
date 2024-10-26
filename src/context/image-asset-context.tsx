import { ImageAsset } from '@/services/assets'
import { ImageService } from '@/services/imageService'
import { createContext, ReactNode, useContext } from 'react'


type ImageAssetContextProps = {
    getAsset(id: string): ImageAsset | undefined
}
const ImageAssetContext = createContext<ImageAssetContextProps>({
    getAsset() {
        return undefined
    },
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
        }}
    >
        <h1>test: {(!!imageService).toString()}</h1>
        {children}
    </ImageAssetContext.Provider>
}

export const useImageAssets = () => {
    return useContext(ImageAssetContext)
}