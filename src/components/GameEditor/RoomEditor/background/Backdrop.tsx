import { BackgroundLayer } from "@/definitions"
import imageService from "@/services/imageService"

export const BackDrop = ({ layer, filter }: { layer: BackgroundLayer, filter?: string }) => {
    const href = imageService.get(layer.imageId)?.href
    if (!href) {
        return null
    }
    return <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("${href}")`,
        backgroundSize: '100% 100%',
        filter: filter,
    }}>
    </div>
}