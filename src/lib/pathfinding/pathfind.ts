import { AStarFinder } from "astar-typescript";
import { CellMatrix } from "./cells";
import { XY } from 'typed-geometry'

const invertMatrix = (cellMatrix: CellMatrix): CellMatrix => {
    return cellMatrix
        .map(row => row.map(cell => cell))
        .reverse()
}

const isOutOfBounds = (cell: XY, matrix: CellMatrix): boolean => {
    return cell.x >= matrix[0].length ||
        cell.y >= matrix.length ||
        cell.x < 0 ||
        cell.y < 0
}

export function findPath(start: XY, goal: XY, matrix: CellMatrix, cellSize: number): XY[] {
    const toCell = (point: XY): XY => {
        return {
            x: Math.floor(point.x / cellSize),
            y: Math.floor(point.y / cellSize)
        }
    }
    const toPoint = (pathPair: [number, number]): XY => {
        return {
            x: (pathPair[0] + .5) * cellSize,
            y: (pathPair[1] + .5) * cellSize
        }
    }

    const invertedMatrix = invertMatrix(matrix)
    const startCell = toCell(start)
    const goalCell = toCell(goal)

    if (isOutOfBounds(startCell, invertedMatrix)) {
        return []
    }
    if (isOutOfBounds(goalCell, invertedMatrix)) {
        return []
    }

    const finder = new AStarFinder({ grid: { matrix: invertedMatrix } })
    const pathPairs = finder.findPath(startCell, goalCell);

    if (pathPairs.length === 0) {
        return []
    }

    const pathPoints = (pathPairs as [number, number][]).map(toPoint)
    // adding goal to the can make the actor go backwards at the end
    // pathPoints.push(goal)
    return pathPoints
}
