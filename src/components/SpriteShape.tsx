import { h, JSX, FunctionalComponent } from "preact";
import { sprites } from "../../data/sprites"
import { RoomData } from "../definitions/RoomData"
import { placeOnScreen } from "../lib/util";
import { Direction } from "../definitions/SpriteSheet";

interface Props {
    roomData: RoomData;
    viewAngle: number;
    x: number;
    y: number;
    height?: number;
    width?: number;
    sprite: string;
    animationName?: string;
    frameIndex?: number;
    direction: Direction;
    filter?: string;
    clickHandler?: JSX.MouseEventHandler<SVGElement>;
}


export const SpriteShape: FunctionalComponent<Props> = ({
    roomData, viewAngle, x, y, height = 50, width = 50, animationName, frameIndex, sprite, direction, filter,
    clickHandler
}: Props) => {

    const spriteObject = sprites[sprite];
    if (!spriteObject) { return null }
    const [widthScale, heightScale] = spriteObject.getFrameScale(animationName, frameIndex, direction);
    const divStyle = Object.assign(spriteObject.getStyle(animationName, frameIndex, direction), { filter });

    const svgStyle: JSX.CSSProperties = {
        overflow: 'hidden',
        pointerEvents: clickHandler ? 'default' : 'none'
    }

    return (
        <svg
            onClick={clickHandler}
            style={svgStyle}
            x={placeOnScreen(x - (width / 2), viewAngle, roomData)}
            y={roomData.height - y - height} >
            <foreignObject x="0" y="0" width={width * widthScale} height={height * heightScale}>
                <div style={divStyle} />
            </foreignObject>
        </svg>
    )
}