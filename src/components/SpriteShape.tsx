import { h, JSX, FunctionalComponent } from "preact";
import { RoomData, CharacterData, Direction } from "src"
import { placeOnScreen } from "../lib/util";
import { Sprite } from "../../src/lib/Sprite";
import { HandleHoverFunction } from "./Game";


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
    handleHover?: HandleHoverFunction;
    hoverData?: CharacterData;
    status?: string;
}


export const SpriteShape: FunctionalComponent<Props> = ({
    roomData, viewAngle, x, y, height = 50, width = 50, animationName, frameIndex, spriteObject, direction, filter,
    clickHandler, handleHover, hoverData, status,
}: Props) => {
    const [widthScale, heightScale] = spriteObject.getFrameScale(animationName, frameIndex, direction);
    const divStyle = Object.assign(spriteObject.getStyle(animationName, frameIndex, direction), { filter });

    const svgStyle: JSX.CSSProperties = {
        overflow: 'hidden',
        pointerEvents: clickHandler ? 'default' : 'none'
    }

    const shouldReportHover = !!(handleHover && hoverData);
    const onMouseEnter = shouldReportHover ? (): void => { handleHover(hoverData, 'enter') } : undefined
    const onMouseLeave = shouldReportHover ? (): void => { handleHover(hoverData, 'leave') } : undefined

    return (
        <svg data-status={status}
            onClick={clickHandler}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={svgStyle}
            x={placeOnScreen(x - (width / 2), viewAngle, roomData)}
            y={roomData.height - y - height} >
            <foreignObject x="0" y="0" width={width * widthScale} height={height * heightScale}>
                <div style={divStyle} />
            </foreignObject>
        </svg>
    )
}