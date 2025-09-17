import { BackgroundLayer, RoomData } from "@/definitions"
import { getLayerWidth, getXShift } from "@/lib/roomFunctions";
import { useAssets } from "@/context/asset-context";

interface Props {
    layer: BackgroundLayer;
    roomData: RoomData;
    viewAngleX: number;
    viewAngleY: number;
}

export default function BackgroundShape({ layer, roomData, viewAngleX, viewAngleY }: Props) {
    const { parallax, imageId, placement } = layer
    const { frameWidth, height: roomHeight } = roomData

    const { getImageAsset } = useAssets()

    const imageUrl = getImageAsset(imageId)?.href;

    const layerWidth = getLayerWidth(parallax, roomData)

    const centerX = (frameWidth / 2) + getXShift(viewAngleX, parallax, roomData)
    const left = centerX - layerWidth / 2



    if (placement) {
        return <svg x={left} y={0} style={{ overflow: 'visible', pointerEvents: 'none' }}>
        <image 
            {...placement}
            href={imageUrl} 
            preserveAspectRatio='none' />
    </svg>
    }

    return <svg x={left} y={0} style={{ overflow: 'visible', pointerEvents: 'none' }}>
        <image width={layerWidth} height={roomHeight} href={imageUrl} preserveAspectRatio='none' />
    </svg>
}