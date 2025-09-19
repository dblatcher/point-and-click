import { useAssets } from "@/context/asset-context";
import { BackgroundLayer } from "@/definitions";
import { useRoomRender } from "@/hooks/useRoomRender";
import { getLayerHeight, getLayerWidth, getXShift, getYShift } from "@/lib/roomFunctions";

interface Props {
    layer: BackgroundLayer;
}

export default function BackgroundShape({ layer }: Props) {
    const { roomData, viewAngleX, viewAngleY } = useRoomRender()
    const { parallax, imageId, placement } = layer
    const { frameWidth, height: roomHeight, frameHeight = roomHeight } = roomData

    const { getImageAsset } = useAssets()

    const imageUrl = getImageAsset(imageId)?.href;

    const layerWidth = getLayerWidth(parallax, roomData)
    const centerX = (frameWidth / 2) + getXShift(viewAngleX, parallax, roomData)
    const left = centerX - layerWidth / 2

    const layerHeight = getLayerHeight(parallax, roomData)
    const centerY = (frameHeight / 2) + getYShift(viewAngleY, parallax, roomData)
    const top = centerY - layerHeight / 2

    if (placement) {
        return <svg x={left} y={top} style={{ overflow: 'visible', pointerEvents: 'none' }}>
            <image
                {...placement}
                href={imageUrl}
                preserveAspectRatio='none' />
        </svg>
    }

    return <svg x={left} y={top} style={{ overflow: 'visible', pointerEvents: 'none' }} data-y={viewAngleY}>
        <image width={layerWidth} height={layerHeight} href={imageUrl} preserveAspectRatio='none' />
    </svg>
}