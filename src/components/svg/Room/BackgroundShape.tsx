import { BackgroundLayer, RoomData } from "@/definitions"
import { getLayerWidth, getShift } from "@/lib/roomFunctions";
import { useAssets } from "@/context/asset-context";

interface Props {
    layer: BackgroundLayer;
    roomData: RoomData;
    viewAngle: number;
}

export default function BackgroundShape({ layer, roomData, viewAngle }: Props) {
    const { parallax, imageId } = layer
    const { frameWidth, height: roomHeight } = roomData

    const { getImageAsset } = useAssets()

    const imageUrl = getImageAsset(imageId)?.href;

    const layerWidth = getLayerWidth(parallax, roomData)

    const center = (frameWidth / 2) + getShift(viewAngle, parallax, roomData)
    const left = center - layerWidth / 2

    return <svg x={left} y={0} style={{ overflow: 'visible', pointerEvents: 'none' }}>
        <image width={layerWidth} height={roomHeight} href={imageUrl} preserveAspectRatio='none' />
    </svg>
}