import { h } from "preact";
import { BackgroundLayer, RoomData } from "../../lib/RoomData"
import { mapXvalue } from "../../lib/util";

interface Props {
    layer: BackgroundLayer;
    roomData: RoomData;
    x: number;
}


export default function BackgroundShape({ layer, roomData, x }: Props) {


    const start = 0

    const left = mapXvalue(start,layer.parallax,x,roomData)
    const top = 0

    return <svg x={left} y={top} style={{overflow:'visible'}}>

        <image  width={layer.width} height={roomData.height} href={layer.url}>
        </image>
    </svg>


}