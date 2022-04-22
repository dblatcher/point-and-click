import { sprites } from "../sprites"
import { RoomData } from "../lib/RoomData"
import { placeOnScreen } from "../lib/util";
import { Direction } from "../lib/Sprite";


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
    direction: Direction
    filter?: string
}


export default function SpriteShape({
    roomData, viewAngle, x, y, height = 50, width = 50, sequence, frameIndex, sprite, direction, filter
}: Props) {

    const style = sprites[sprite]?.getStyle(sequence, frameIndex, direction);

    style.filter = filter

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