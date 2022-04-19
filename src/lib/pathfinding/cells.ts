import { RoomData } from "../RoomData"
import { Circle, isPointInsideCircle, isPointInsidePolygon, isPointInsideRectangle, Point, Rectangle } from "./geometry"

type CellMatrix = (0 | 1)[][]


export type { CellMatrix }

function isCellWalkable(
    rowIndex: number, cellIndex: number, cellSize: number,
    walkablePolygons: Point[][],
    walkableRectangles: Rectangle[],
    walkableCircles: Circle[]
): boolean {
    const cellCenter: Point = {
        x: (cellIndex + .5) * cellSize,
        y: (rowIndex - .5) * cellSize,
    }

    const higherPoint: Point = {
        x: cellCenter.x,
        y: cellCenter.y + (cellSize / 10)
    }

    return isPointWalkable(cellCenter, walkablePolygons, walkableRectangles, walkableCircles)
        && isPointWalkable(higherPoint, walkablePolygons, walkableRectangles, walkableCircles)
}

export function isPointWalkable(point: Point, walkablePolygons: Point[][], walkableRectangles: Rectangle[], walkableCircles: Circle[]): boolean {
    return walkablePolygons.some(polygon => isPointInsidePolygon(point, polygon))
        || walkableRectangles.some(rectangle => isPointInsideRectangle(point, rectangle))
        || walkableCircles.some(circle => isPointInsideCircle(point, circle))
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

export function getWalkableCircles(roomData: RoomData): Circle[] {
    return roomData.walkableAreas
        .filter(area => area.circle)
        .map(area => {
            const { x, y, circle } = area
            const radius = circle
            return {
                x, y, radius
            }
        })
}

export function generateCellMatrix(roomData: RoomData, cellSize: number) {
    const { width, height } = roomData
    const walkablePolygons = getWalkablePolygons(roomData)
    const walkableRectangles = getWalkableRectangle(roomData)
    const walkableCircles = getWalkableCircles  (roomData)
    const matrixHeight = Math.ceil(height / cellSize)
    const matrixWidth = Math.ceil(width / cellSize)
    const matrix: CellMatrix = [];

    for (let i = 0; i < matrixHeight; i++) {
        const row = []
        for (let j = 0; j < matrixWidth; j++) {
            row.push(
                isCellWalkable(matrixHeight - i, j, cellSize, walkablePolygons, walkableRectangles, walkableCircles) ? 1:0
            )
        }
        matrix.push(row)
    }
    return matrix
}