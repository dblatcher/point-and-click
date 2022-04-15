import { h } from "preact";
import { BackgroundLayer, RoomData } from "../../lib/RoomData"
import { mapXvalue } from "../../lib/util";

interface Props {
    layer: BackgroundLayer;
    roomData: RoomData;
    x: number;
}


export default function BackgroundShape({ layer, roomData, x }: Props) {

    const { parallax, url, width: layerWidth, x: layerX = 0 } = layer
    const { frameWidth, width: roomWidth, height: roomHeight } = roomData

    // asumption - layer is full width and parallax is in proportion to frame
    const start = layerX
    const imageWidth = layerWidth ||
        frameWidth + (parallax * (roomWidth - frameWidth))

    const left = mapXvalue(start, parallax, x, roomData)
    const top = 0

    return <svg x={left} y={top} style={{ overflow: 'visible' }}>

        <image width={imageWidth} height={roomHeight} href={url}>
        </image>
    </svg>


}