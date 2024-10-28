import { ImageAsset } from '@/services/assets'
import { ImageService } from '@/services/imageService'
import { createContext, ReactNode, useContext } from 'react'


type AssetContextProps = {
    getAsset(id: string): ImageAsset | undefined;
    listIds(): string[];
    getAllAssets(): ImageAsset[];
    imageService: ImageService;
}
const AssetContext = createContext<AssetContextProps>({
    getAsset() {
        return undefined
    },
    listIds() {
        return []
    },
    getAllAssets() {
        return []
    },
    imageService: new ImageService()
})

type AssetsProviderProps = {
    children: ReactNode,
    imageService: ImageService
}

export const AssetsProvider = ({ children, imageService }: AssetsProviderProps) => {

    return <AssetContext.Provider
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
            imageService,
        }}
    >
        {children}
    </AssetContext.Provider>
}

export const useAssets = () => {
    return useContext(AssetContext)
}