import { useRoomRender } from "@/hooks/useRoomRender";
import { getXShift, getYShift } from "@/lib/roomFunctions";
import { FunctionComponent, ReactNode } from "react";

export interface ParallaxPlaceProps {
    x: number,
    y: number,
    parallax: number,
}

export const ParallaxPlace: FunctionComponent<ParallaxPlaceProps & { children?: ReactNode }> = ({
    x, y, parallax, children
}) => {
    const { roomData, viewAngleX, viewAngleY } = useRoomRender()
    const displayX = x + getXShift(viewAngleX, parallax, roomData)
    const displayY = roomData.height - y + getYShift(viewAngleY, parallax, roomData)

    return (
        <svg x={displayX} y={displayY} style={{ overflow: 'visible', pointerEvents: 'none' }}>
            <g>{children}</g>
        </svg>
    )
}