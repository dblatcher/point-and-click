import { RoomData } from "../../definitions/RoomData"
import { Zone } from "../../definitions/Zone"
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


function getObstaclePolygons(obstacleAreas: Zone[]): Point[][] {
    return obstacleAreas
        .filter(area => area.polygon)
        .map(area => {
            const { x, y, polygon = [] } = area as Zone
            return polygon.map(coords => {
                return { x: x + coords[0], y: y + coords[1] }
            })
        })
}

function getObstacleRectangle(obstacleAreas: Zone[]): Rectangle[] {
    return obstacleAreas
        .filter(area => area.rect)
        .map(area => {
            const { x, y, rect } = area as Zone & { rect: [number, number] }
            const [width, height] = rect
            return {
                x, y: y - height, width, height
            }
        })
}

function getObstacleCircles(obstacleAreas: Zone[]): Circle[] {
    return obstacleAreas
        .filter(area => area.circle)
        .map(area => {
            const { x, y, circle } = area as Zone & { circle: number }
            const radius = circle
            return {
                x, y, radius
            }
        })
}

export function generateCellMatrix(roomData: RoomData, cellSize: number) {
    const { width, height, obstacleAreas = [] } = roomData
    const obstaclePolygons = getObstaclePolygons(obstacleAreas)
    const obstacleRectangles = getObstacleRectangle(obstacleAreas)
    const obstacleCircles = getObstacleCircles(obstacleAreas)
    const matrixHeight = Math.ceil(height / cellSize)
    const matrixWidth = Math.ceil(width / cellSize)
    const matrix: CellMatrix = [];

    for (let i = 0; i < matrixHeight; i++) {
        const row: (0 | 1)[] = []
        for (let j = 0; j < matrixWidth; j++) {
            row.push(
                isCellObstacle(matrixHeight - i, j, cellSize, obstaclePolygons, obstacleRectangles, obstacleCircles) ? 1 : 0
            )
        }
        matrix.push(row)
    }
    return matrix
}