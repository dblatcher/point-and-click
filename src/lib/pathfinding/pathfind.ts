import { AStarFinder } from "astar-typescript";
import { CellMatrix } from "./cells";
import { Point } from "./geometry";


const invertMatrix = (cellMatrix: CellMatrix): CellMatrix => {
    return cellMatrix.map(row => row.map(cell => cell === 1 ? 0 : 1)).reverse()
}

export function findPath(start: Point, goal: Point, matrix: CellMatrix, cellSize: number): Point[] {
    const invertedMatrix = invertMatrix(matrix)
    const toCell = (point: Point): Point => {
        return {
            x: Math.floor(point.x / cellSize),
            y: Math.floor(point.y / cellSize)
        }
    }
    const toPoint = (pathPair: [number, number]): Point => {
        return {
            x: (pathPair[0] + .5) * cellSize,
            y: (pathPair[1] + .5) * cellSize
        }
    }

    const finder = new AStarFinder({ grid: { matrix: invertedMatrix } })
    const pathPairs = finder.findPath(toCell(start), toCell(goal));

    if (pathPairs.length === 0 ) {
        return []
    }

    const pathPoints = (pathPairs as [number, number][]).map(toPoint)
    pathPoints.push(goal)
    return pathPoints
}
