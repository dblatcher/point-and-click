import { h } from "preact";
import { BackgroundLayer, RoomData } from "../../definitions/RoomData"
import { getLayerWidth, getShift } from "../../lib/util";


interface Props {
    layer: BackgroundLayer;
    roomData: RoomData;
    viewAngle: number;
}


export default function BackgroundShape({ layer, roomData, viewAngle }: Props) {
    const { parallax, url } = layer
    const { frameWidth, height: roomHeight } = roomData

    const layerWidth = getLayerWidth(parallax, roomData)

    const center = (frameWidth / 2) + getShift(viewAngle,parallax,roomData)
    const left = center - layerWidth / 2

    return <svg x={left} y={0} style={{ overflow: 'visible' }}>
        <image width={layerWidth} height={roomHeight} href={url} preserveAspectRatio='none'>
        </image>
    </svg>
}