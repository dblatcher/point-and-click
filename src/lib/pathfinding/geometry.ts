import { XY } from 'typed-geometry'

interface Circle extends XY {
    radius: number;
}
interface Rectangle extends XY {
    width: number;
    height: number;
}

export function isPointInsideRectangle(point: XY, rectangle: Rectangle): boolean {
    const { x, y, width, height } = rectangle
    return point.x >= x && point.x <= (x + width) && point.y >= y && point.y <= y + height
}

export function isPointInsideCircle(point: XY, circle: Circle): boolean {
    const { x, y, radius } = circle
    return Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2) <= radius
}

export type { Rectangle, Circle }