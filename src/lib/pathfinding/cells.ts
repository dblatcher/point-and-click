import { RoomData } from "../RoomData"
import { isPointInsidePolygon, isPointInsideRectangle, Point, Rectangle } from "./geometry"

type CellMatrix = (0 | 1)[][]


export type { CellMatrix }

function isCellWalkable(
    rowIndex: number, cellIndex: number, cellSize: number,
    walkablePolygons: Point[][],
    walkableRectangles: Rectangle[]
): boolean {
    const cellCenter: Point = {
        x: (cellIndex + .5) * cellSize,
        y: (rowIndex - .5) * cellSize,
    }

    const higherPoint: Point = {
        x: cellCenter.x,
        y: cellCenter.y + (cellSize / 10)
    }

    return isPointWalkable(cellCenter, walkablePolygons, walkableRectangles)
        && isPointWalkable(higherPoint, walkablePolygons, walkableRectangles)
}

export function isPointWalkable(point: Point, walkablePolygons: Point[][], walkableRectangles: Rectangle[]): boolean {
    return walkablePolygons.some(polygon => isPointInsidePolygon(point, polygon))
        || walkableRectangles.some(rectangle => isPointInsideRectangle(point, rectangle))
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

export function getWalkableRectangle(roomData: RoomData): Rectangle[] {
    return roomData.walkableAreas
        .filter(area => area.rect)
        .map(area => {
            const { x, y, rect } = area
            const [width, height] = rect
            return {
                x, y: y - height, width, height
            }
        })
}

export function generateCellMatrix(roomData: RoomData, cellSize: number) {
    const { width, height } = roomData
    const walkablePolygons = getWalkablePolygons(roomData)
    const walkableRectangles = getWalkableRectangle(roomData)
    const matrixHeight = Math.ceil(height / cellSize)
    const matrixWidth = Math.ceil(width / cellSize)
    const matrix: CellMatrix = [];

    for (let i = 0; i < matrixHeight; i++) {
        const row = []
        for (let j = 0; j < matrixWidth; j++) {
            row.push(isCellWalkable(matrixHeight - i, j, cellSize, walkablePolygons, walkableRectangles))
        }
        matrix.push(row)
    }
    return matrix
}