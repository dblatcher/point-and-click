import { RoomData } from "@/definitions";
import { getXShift, getYShift } from "@/lib/roomFunctions";
import { FunctionComponent, ReactNode } from "react";

export interface ParallaxPlaceProps {
    x: number,
    y: number,
    parallax: number,
    roomData: RoomData;
    viewAngleX: number;
    viewAngleY: number;
}

export const ParallaxPlace: FunctionComponent<ParallaxPlaceProps & { children?: ReactNode }> = ({
    x, y, parallax, roomData, viewAngleX, children, viewAngleY
}) => {

    const displayX = x + getXShift(viewAngleX, parallax, roomData)
    const displayY = roomData.height - y + getYShift(viewAngleY, parallax, roomData)

    return (
        <svg x={displayX} y={displayY} style={{ overflow: 'visible', pointerEvents: 'none' }}>
            <g>
                {children}
            </g>
        </svg>
    )
}