import { RoomData } from "../RoomData"
import { Circle, isPointInsideCircle, isPointInsidePolygon, isPointInsideRectangle, Point, Rectangle } from "./geometry"

type CellMatrix = (0 | 1)[][]


export type { CellMatrix }

function isCellObstacle(
    rowIndex: number, cellIndex: number, cellSize: number,
    obstaclePolygons: Point[][],
    obstacleRectangles: Rectangle[],
    obstacleCircles: Circle[]
): boolean {
    const cellCenter: Point = {
        x: (cellIndex + .5) * cellSize,
        y: (rowIndex - .5) * cellSize,
    }

    const higherPoint: Point = {
        x: cellCenter.x,
        y: cellCenter.y + (cellSize / 10)
    }

    return isPointObstacle(cellCenter, obstaclePolygons, obstacleRectangles, obstacleCircles)
        && isPointObstacle(higherPoint, obstaclePolygons, obstacleRectangles, obstacleCircles)
}

export function isPointObstacle(point: Point, obstaclePolygons: Point[][], obstacleRectangles: Rectangle[], obstacleCircles: Circle[]): boolean {
    return obstaclePolygons.some(polygon => isPointInsidePolygon(point, polygon))
        || obstacleRectangles.some(rectangle => isPointInsideRectangle(point, rectangle))
        || obstacleCircles.some(circle => isPointInsideCircle(point, circle))
}


export function getObstaclePolygons(roomData: RoomData): Point[][] {
    return roomData.obstacleAreas
        .filter(area => area.polygon)
        .map(area => {
            const { x, y, polygon } = area
            return polygon.map(coords => {
                return { x: x + coords[0], y: y + coords[1] }
            })
        })
}

export function getObstacleRectangle(roomData: RoomData): Rectangle[] {
    return roomData.obstacleAreas
        .filter(area => area.rect)
        .map(area => {
            const { x, y, rect } = area
            const [width, height] = rect
            return {
                x, y: y - height, width, height
            }
        })
}

export function getObstacleCircles(roomData: RoomData): Circle[] {
    return roomData.obstacleAreas
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
    const obstaclePolygons = getObstaclePolygons(roomData)
    const obstacleRectangles = getObstacleRectangle(roomData)
    const obstacleCircles = getObstacleCircles  (roomData)
    const matrixHeight = Math.ceil(height / cellSize)
    const matrixWidth = Math.ceil(width / cellSize)
    const matrix: CellMatrix = [];

    for (let i = 0; i < matrixHeight; i++) {
        const row = []
        for (let j = 0; j < matrixWidth; j++) {
            row.push(
                isCellObstacle(matrixHeight - i, j, cellSize, obstaclePolygons, obstacleRectangles, obstacleCircles) ? 1:0
            )
        }
        matrix.push(row)
    }
    return matrix
}