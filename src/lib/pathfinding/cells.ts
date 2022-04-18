import { RoomData } from "../RoomData"
import { isPointInsidePolygon, Point } from "./geometry"

type CellMatrix = (0 | 1)[][]


export type { CellMatrix }

function isCellWalkable(rowIndex: number, cellIndex: number, walkablePolygons: Point[][], cellSize: number): boolean {
    const cellCenter: Point = {
        x: (cellIndex + .5) * cellSize,
        y: (rowIndex - .5) * cellSize,
    }

    const higherPoint: Point = {
        x: cellCenter.x,
        y: cellCenter.y + (cellSize / 10)
    }

    return isPointWalkable(cellCenter, walkablePolygons) && isPointWalkable(higherPoint, walkablePolygons)
}

export function isPointWalkable(point: Point, walkablePolygons: Point[][]): boolean {
    return walkablePolygons.some(walkable => isPointInsidePolygon(point, walkable))
}


export function getWalkablePolygons(roomData: RoomData): Point[][] {

    return roomData.walkableAreas
        .filter(area => area.polygon)
        .map(area => {
            const { x, y, polygon } = area
            return polygon.map(coords => {
                return { x: x + coords[0], y: y + coords[1] }
            })
        })
}

export function generateCellMatrix(roomData: RoomData, cellSize: number) {

    const { width, height } = roomData
    const walkablePolygons = getWalkablePolygons(roomData)
    const matrixHeight = Math.ceil(height / cellSize)
    const matrixWidth = Math.ceil(width / cellSize)
    const matrix: CellMatrix = [];

    for (let i = 0; i < matrixHeight; i++) {
        const row = []
        for (let j = 0; j < matrixWidth; j++) {
            row.push(isCellWalkable(matrixHeight - i, j, walkablePolygons, cellSize))
        }
        matrix.push(row)
    }
    return matrix
}