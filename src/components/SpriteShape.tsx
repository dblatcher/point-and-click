import { sprites } from "../../data/sprites"
import { RoomData } from "../definitions/RoomData"
import { placeOnScreen } from "../lib/util";
import { Direction } from "../definitions/SpriteSheet";


interface Props {
    roomData: RoomData
    viewAngle: number
    x: number
    y: number
    height?: number
    width?: number
    sprite: string
    animationName?: string
    frameIndex?: number
    direction: Direction
    filter?: string
    clickHandler?: Function
}


export default function SpriteShape({
    roomData, viewAngle, x, y, height = 50, width = 50, animationName, frameIndex, sprite, direction, filter,
    clickHandler = null
}: Props) {

    const divStyle = sprites[sprite]?.getStyle(animationName, frameIndex, direction);
    divStyle.filter = filter

    const svgStyle = {
        overflow: 'hidden',
        pointerEvents: clickHandler ? 'default' : 'none'
    }

    return (
        <svg
            onClick={clickHandler}
            style={svgStyle}
            x={placeOnScreen(x - (width / 2), viewAngle, roomData)}
            y={roomData.height - y - height} >
            <foreignObject x="0" y="0" width={width} height={height}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={divStyle}></div>
            </foreignObject>
        </svg>
    )
}