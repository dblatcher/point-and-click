import { ActorData, RoomData } from "@/definitions";
import { placeOnScreen } from "@/lib/roomFunctions";
import { ImageAsset } from "@/services/assets";
import { CSSProperties, FunctionComponent, MouseEventHandler } from "react";
import { HandleHoverFunction } from "../game";


interface Props {
    frame?: { row: number, col: number },
    asset: ImageAsset;
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


const getStyle = (frame: { row: number, col: number }, asset: ImageAsset, filter?: string) => {
    const { href, cols = 1, rows = 1 } = asset
    return {
        backgroundImage: `url(${href})`,
        backgroundPositionX: `${-100 * frame.col}%`,
        backgroundPositionY: `${-100 * frame.row}%`,
        backgroundSize: `${100 * cols}% ${100 * rows}%`,
        width: '100%',
        height: '100%',
        filter,
    }
}

export const FrameShape: FunctionComponent<Props> = ({
    frame = { row: 0, col: 0 }, asset,
    roomData, viewAngle, x, y, height = 50, width = 50, filter,
    clickHandler, handleHover, hoverData, status,
}: Props) => {
    const { widthScale = 1, heightScale = 1 } = asset
    const divStyle = getStyle(frame, asset, filter)

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