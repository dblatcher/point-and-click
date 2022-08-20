import { h, FunctionalComponent } from "preact";
import { CellMatrix } from "../../lib/pathfinding/cells";
import { RoomData } from "src"
import { getShift } from "../../lib/roomFunctions";


interface Props {
    roomData: RoomData;
    viewAngle: number;
    cellMatrix: CellMatrix;
}

export const ObstacleCellOverlay: FunctionalComponent<Props> = ({ roomData, viewAngle, cellMatrix }: Props) => {
    const { frameWidth, height: roomHeight } = roomData
    const center = (frameWidth / 2) + getShift(viewAngle, 1, roomData)
    const left = center - roomData.width / 2
    const cellSize = roomHeight / cellMatrix.length

    return <svg x={left} y={0} style={{ overflow: 'visible' }}>

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