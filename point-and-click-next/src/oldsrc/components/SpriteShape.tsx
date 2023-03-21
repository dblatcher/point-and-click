import { CSSProperties, FunctionComponent, MouseEventHandler } from "react";
import { RoomData, ActorData, Direction } from "../"
import { placeOnScreen } from "../../lib/roomFunctions";
import { Sprite } from "../../lib/Sprite";
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
    clickHandler?: MouseEventHandler<SVGElement>;
    handleHover?: HandleHoverFunction;
    hoverData?: ActorData;
    status?: string;
}


export const SpriteShape: FunctionComponent<Props> = ({
    roomData, viewAngle, x, y, height = 50, width = 50, animationName, frameIndex, spriteObject, direction, filter,
    clickHandler, handleHover, hoverData, status,
}: Props) => {
    const [widthScale, heightScale] = spriteObject.getFrameScale(animationName, frameIndex, direction);
    const divStyle = Object.assign(spriteObject.getStyle(animationName, frameIndex, direction), { filter });

    const svgStyle: CSSProperties = {
        overflow: 'hidden',
        pointerEvents: clickHandler ? 'auto' : 'none'
    }

    const widthAdjustedByScale = width * widthScale
    const heightAdjustedByScale = height * heightScale

    const shouldReportHover = !!(handleHover && hoverData);
    const onMouseEnter = shouldReportHover ? (): void => { handleHover(hoverData, 'enter') } : undefined
    const onMouseLeave = shouldReportHover ? (): void => { handleHover(hoverData, 'leave') } : undefined

    return (
        <svg data-status={status}
            onClick={clickHandler}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={svgStyle}
            x={placeOnScreen(x - (widthAdjustedByScale / 2), viewAngle, roomData)}
            y={roomData.height - y - heightAdjustedByScale} >
            <foreignObject x="0" y="0" width={widthAdjustedByScale} height={heightAdjustedByScale}>
                <div style={divStyle} />
            </foreignObject>
        </svg>
    )
}