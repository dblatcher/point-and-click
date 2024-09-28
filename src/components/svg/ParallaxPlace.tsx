import { RoomData } from "@/definitions";
import { getShift } from "@/lib/roomFunctions";
import { FunctionComponent, ReactNode } from "react";

interface Props {
    x: number,
    y: number,
    parallax: number,
    roomData: RoomData;
    viewAngle: number;
    children?: ReactNode;
}

export const ParallaxPlace: FunctionComponent<Props> = ({
    x, y, parallax, roomData, viewAngle, children
}: Props) => {

    const displayX = x + getShift(viewAngle, parallax, roomData)
    const displayY = roomData.height - y

    return (
        <svg x={displayX} y={displayY} style={{ overflow: 'visible' }}>
            <g>
                {children}
            </g>
        </svg>
    )
}