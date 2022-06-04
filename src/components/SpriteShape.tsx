import { h, JSX, FunctionalComponent } from "preact";
import { RoomData } from "../definitions/RoomData"
import { placeOnScreen } from "../lib/util";
import { Direction } from "../definitions/SpriteSheet";
import { Sprite } from "../../src/lib/Sprite";

interface Props {
    spriteObject: Sprite;
    animationName?: string;
    direction: Direction;
    frameIndex?: number;
    roomData: RoomData;
    viewAngle: number;
    x: number;
    y: number;
    height?: number;
    width?: number;
    filter?: string;
    clickHandler?: JSX.MouseEventHandler<SVGElement>;
}


export const SpriteShape: FunctionalComponent<Props> = ({
    roomData, viewAngle, x, y, height = 50, width = 50, animationName, frameIndex, spriteObject, direction, filter,
    clickHandler
}: Props) => {
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