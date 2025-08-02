interface Point { x: number; y: number }

interface Circle extends Point {
    radius: number;
}
interface Rectangle extends Point {
    width: number;
    height: number;
}

export function isPointInsideRectangle(point: Point, rectangle: Rectangle): boolean {
    const { x, y, width, height } = rectangle
    return point.x >= x && point.x <= (x + width) && point.y >= y && point.y <= y + height
}

export function isPointInsideCircle(point: Point, circle: Circle): boolean {
    const { x, y, radius } = circle
    return Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2) <= radius
}

export type { Point, Rectangle, Circle }