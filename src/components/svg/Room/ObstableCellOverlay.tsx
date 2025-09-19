import {  FunctionComponent } from "react";
import { CellMatrix } from "@/lib/pathfinding/cells";
import { RoomData } from "@/definitions"
import { getXShift, getYShift } from "@/lib/roomFunctions";


interface Props {
    roomData: RoomData;
    viewAngleX: number;
    viewAngleY: number;
    cellMatrix: CellMatrix;
}

export const ObstacleCellOverlay: FunctionComponent<Props> = ({ roomData, viewAngleX, viewAngleY, cellMatrix }: Props) => {
    const { frameWidth, height: roomHeight, frameHeight=roomHeight } = roomData
    const centerX = (frameWidth / 2) + getXShift(viewAngleX, 1, roomData)
    const left = centerX - roomData.width / 2
    const centerY = (frameHeight / 2) + getYShift(viewAngleY, 1, roomData)
    const top = centerY - roomData.height / 2


    const cellSize = roomHeight / cellMatrix.length

    return <svg x={left} y={top} style={{ overflow: 'visible' }} data-is="ObstacleCellOverlay">

        {cellMatrix.map((row, rowIndex) => (
            <g key={rowIndex}>
                {row.map((cell, cellIndex) => {
                    return (cell === 1) ? <rect key={cellIndex}
                        x={cellIndex * cellSize} y={rowIndex * cellSize}
                        width={cellSize} height={cellSize} style={{
                            fill: 'rgba(255,0,0,.75)',
                        }} />
                        : null
                })}
            </g>
        ))}
    </svg>
}

export default ObstacleCellOverlay;