import { FunctionComponent } from "react";
import { RoomData } from "@/definitions"
import { calculateScreenX } from "@/lib/roomFunctions";

interface Props {
    roomData: RoomData;
    x: number;
    y?: number;
    height?: number;
    viewAngle: number;
    color: string;
    text?: string;
}

const CROSS_SIZE = 8

export const MarkerShape: FunctionComponent<Props> = ({
    roomData, x, viewAngle, color, y = 0, height = 50, text
}: Props) => {

    const textToDisplay = text || `${x.toFixed(0)},${y.toFixed(0)}`
    const displayY = roomData.height - y
    const displayX = calculateScreenX(x, viewAngle, roomData)

    return (
        <svg
            style={{ overflow: 'visible' }}
            x={displayX}
            y={displayY - height} >
            <line
                x1={0} x2={0} y1={0} y2={height}
                stroke={'black'} strokeWidth={3} />
            <line
                x1={-CROSS_SIZE} y1={height - CROSS_SIZE}
                x2={CROSS_SIZE} y2={height + CROSS_SIZE}
                stroke={'black'} strokeWidth={3} />
            <line
                x1={CROSS_SIZE} y1={height - CROSS_SIZE}
                x2={-CROSS_SIZE} y2={height + CROSS_SIZE}
                stroke={'black'} strokeWidth={3} />
            <line
                x1={0} x2={0} y1={0} y2={height}
                stroke={'white'} />
            <line
                x1={-CROSS_SIZE} y1={height - CROSS_SIZE}
                x2={CROSS_SIZE} y2={height + CROSS_SIZE}
                stroke={'white'} />
            <line
                x1={CROSS_SIZE} y1={height - CROSS_SIZE}
                x2={-CROSS_SIZE} y2={height + CROSS_SIZE}
                stroke={'white'} />

            <text
                stroke={'white'}
                fill={'black'}
                strokeWidth={.25}
                fontSize={15}
                fontFamily='monospace'
            >{textToDisplay}</text>
        </svg>
    )
}