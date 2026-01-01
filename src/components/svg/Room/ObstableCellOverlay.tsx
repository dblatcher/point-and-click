import { useRoomRender } from "@/hooks/useRoomRender";
import { CellMatrix } from "@/lib/pathfinding";
import { FunctionComponent } from "react";


interface Props {
    cellMatrix: CellMatrix;
}

export const ObstacleCellOverlay: FunctionComponent<Props> = ({ cellMatrix }: Props) => {
    const { roomData, surfaceXShift, surfaceYShift } = useRoomRender()
    const { frameWidth, height: roomHeight, frameHeight = roomHeight } = roomData
    const centerX = (frameWidth / 2) + surfaceXShift
    const left = centerX - roomData.width / 2
    const centerY = (frameHeight / 2) + surfaceYShift
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