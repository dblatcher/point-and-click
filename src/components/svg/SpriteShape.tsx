import { ActorData, Direction } from "@/definitions";
import { useRoomRender } from "@/hooks/useRoomRender";
import { Sprite } from "@/lib/Sprite";
import { CSSProperties, FunctionComponent, MouseEventHandler } from "react";
import { HandleHoverFunction } from "../game/types";


interface Props {
    spriteObject: Sprite;
    animationName?: string;
    direction: Direction;
    frameIndex?: number;
    x: number;
    y: number;
    height?: number;
    width?: number;
    filter?: string;
    clickHandler?: MouseEventHandler<SVGElement>;
    contextClickHandler?: MouseEventHandler<SVGElement>;
    handleHover?: HandleHoverFunction;
    hoverData?: ActorData;
    status?: string;
    reverseCycle?: boolean;
}


export const SpriteShape: FunctionComponent<Props> = ({
    x, y, height = 50, width = 50, animationName, frameIndex, spriteObject, direction, filter,
    clickHandler, contextClickHandler, handleHover, hoverData, status,
    reverseCycle
}: Props) => {
    const { roomData } = useRoomRender()
    const [widthScale, heightScale] = spriteObject.getFrameScale(animationName, frameIndex, direction);
    const divStyle = Object.assign(spriteObject.getStyle(animationName, frameIndex, direction, reverseCycle), { filter });

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
            onContextMenu={contextClickHandler}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={svgStyle}
            x={x - (widthAdjustedByScale / 2)}
            y={roomData.height - (y + heightAdjustedByScale)} >
            <foreignObject x="0" y="0" width={widthAdjustedByScale} height={heightAdjustedByScale}>
                <div style={divStyle} />
            </foreignObject>
        </svg>
    )
}