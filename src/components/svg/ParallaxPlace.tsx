import { RoomData } from "@/definitions";
import { getShift } from "@/lib/roomFunctions";
import { FunctionComponent, ReactNode } from "react";

export interface ParallaxPlaceProps {
    x: number,
    y: number,
    parallax: number,
    roomData: RoomData;
    viewAngleX: number;
}

export const ParallaxPlace: FunctionComponent<ParallaxPlaceProps & { children?: ReactNode }> = ({
    x, y, parallax, roomData, viewAngleX, children
}) => {

    const displayX = x + getShift(viewAngleX, parallax, roomData)
    const displayY = roomData.height - y

    return (
        <svg x={displayX} y={displayY} style={{ overflow: 'visible', pointerEvents: 'none' }}>
            <g>
                {children}
            </g>
        </svg>
    )
}