import { sprites } from "../sprites"
import { RoomData } from "../lib/RoomData"
import { placeOnScreen } from "../lib/util";


interface Props {
    roomData: RoomData
    viewAngle: number
    x: number
    y: number
    height?: number
    width?: number
    sprite: string
    sequence?: string
    frameIndex?: number
}


export default function SpriteShape({
    roomData, viewAngle, x, y, height = 50, width = 50, sequence, frameIndex, sprite
}: Props) {

    const style = sprites[sprite]?.getStyle(sequence, frameIndex);

    return (
        <svg
            style={{ overflow: 'hidden' }}
            x={placeOnScreen(x - (width / 2), viewAngle, roomData)}
            y={roomData.height - y - height} >
            <foreignObject x="0" y="0" width={width} height={height}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={style}></div>
            </foreignObject>
        </svg>
    )
}