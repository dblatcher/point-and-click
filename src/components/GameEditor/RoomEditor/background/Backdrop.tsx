import { useAssets } from "@/context/asset-context"
import { BackgroundLayer } from "@/definitions"

export const BackDrop = ({ layer, filter }: { layer: BackgroundLayer, filter?: string }) => {
    const { getAsset } = useAssets()
    const href = getAsset(layer.imageId)?.href
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