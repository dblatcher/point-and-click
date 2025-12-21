import type { RoomData, Zone } from "point-click-lib";
import { isPointInsidePolygon } from "typed-geometry";
import { Circle, isPointInsideCircle, isPointInsideRectangle, Point, Rectangle } from "./geometry";

export type CellMatrix = (0 | 1)[][]

function isCellBlocked(
    rowIndex: number, cellIndex: number, cellSize: number,
    obstacleZones: { polygons: Point[][]; rectangles: Rectangle[]; circles: Circle[] },
    walkableZones: { polygons: Point[][]; rectangles: Rectangle[]; circles: Circle[] } | null,
): boolean {
    const cellCenter: Point = {
        x: (cellIndex + .5) * cellSize,
        y: (rowIndex - .5) * cellSize,
    }


    const isInObstable = isPointInsideAny(cellCenter, obstacleZones)

    if (walkableZones) {
        const isInWalkable = isPointInsideAny(cellCenter, walkableZones)
           

        return isInObstable || !isInWalkable
    }

    return isInObstable
}

export function isPointInsideAny(point: Point, zones: { polygons: Point[][]; rectangles: Rectangle[]; circles: Circle[] }): boolean {
    const { polygons, rectangles, circles } = zones;
    return (
        polygons.some(polygon => isPointInsidePolygon(point, polygon))
        || rectangles.some(rectangle => isPointInsideRectangle(point, rectangle))
        || circles.some(circle => isPointInsideCircle(point, circle))
    )
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
    const { width, height, obstacleAreas = [], walkableAreas = [] } = roomData
    const walkable = walkableAreas.length > 0 ? {
        polygons: getObstaclePolygons(walkableAreas.filter(zone => !zone.disabled)),
        rectangles: getObstacleRectangle(walkableAreas.filter(zone => !zone.disabled)),
        circles: getObstacleCircles(walkableAreas.filter(zone => !zone.disabled)),
    } : null

    const obstable = {
        polygons: getObstaclePolygons(obstacleAreas.filter(zone => !zone.disabled)),
        rectangles: getObstacleRectangle(obstacleAreas.filter(zone => !zone.disabled)),
        circles: getObstacleCircles(obstacleAreas.filter(zone => !zone.disabled)),
    }

    const matrixHeight = Math.ceil(height / cellSize)
    const matrixWidth = Math.ceil(width / cellSize)
    const matrix: CellMatrix = [];

    for (let i = 0; i < matrixHeight; i++) {
        const row: (0 | 1)[] = []
        for (let j = 0; j < matrixWidth; j++) {
            row.push(
                isCellBlocked(matrixHeight - i, j, cellSize, obstable, walkable) ? 1 : 0
            )
        }
        matrix.push(row)
    }
    return matrix
}