// TO DO  - this code was mostly copy pasted from https://github.com/dblatcher/worlds
// importing isPointInsidePolygon was adding ~15kb to the js load
// should build an efficient library for geometry (with test coverage!)

// TO DO - isPointInsidePolygon is buggy?
// can get a missing rows of cells the player can walk through 
// confirmed bug existed when using worlds library

interface Point { x: number; y: number }

interface Circle extends Point {
    radius: number;
}
interface Rectangle extends Point {
    width: number;
    height: number;
}

const _extreme = 10 ** 30

// Given three colinear points p, q, r, the function checks if 
// point q lies on line segment 'pr' 
function onSegment(p: Point, q: Point, r: Point) {
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)) {
        return true;
    }
    return false;
}


// To find orientation of ordered triplet (p, q, r). 
// The function returns following values 
// 0 --> p, q and r are colinear 
// 1 --> Clockwise 
// 2 --> Counterclockwise 
function orientation(p: Point, q: Point, r: Point) {
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val == 0) return 0;  // colinear 
    return (val > 0) ? 1 : 2; // clock or counterclock wise 
}


/**
 * Check if two line segments will intersect
 * 
 * @param segment1 the two points of the first segment
 * @param segment2 the two points of the second segment
 * @returns whether the sements intersect
 */
function doLineSegmentsIntersect(segment1: [Point, Point], segment2: [Point, Point]): boolean {

    // Find the four orientations needed for general and 
    // special cases 
    let o1 = orientation(segment1[0], segment1[1], segment2[0]);
    let o2 = orientation(segment1[0], segment1[1], segment2[1]);
    let o3 = orientation(segment2[0], segment2[1], segment1[0]);
    let o4 = orientation(segment2[0], segment2[1], segment1[1]);

    // General case 
    if (o1 != o2 && o3 != o4) { return true };

    // Special Cases 
    // segment1[0], segment1[1] and segment2[0] are colinear and segment2[0] lies on segment p1q1 
    if (o1 == 0 && onSegment(segment1[0], segment2[0], segment1[1])) { return true };

    // segment1[0], segment1[1] and segment2[1] are colinear and segment2[1] lies on segment p1q1 
    if (o2 == 0 && onSegment(segment1[0], segment2[1], segment1[1])) { return true };

    // segment2[0], segment2[1] and segment1[0] are colinear and segment1[0] lies on segment p2q2 
    if (o3 == 0 && onSegment(segment2[0], segment1[0], segment2[1])) { return true };

    // segment2[0], segment2[1] and segment1[1] are colinear and segment1[1] lies on segment p2q2 
    if (o4 == 0 && onSegment(segment2[0], segment1[1], segment2[1])) { return true };

    return false; // Doesn't fall in any of the above cases 
}


/**
 * PROBLEM - seems to fail when squares are at a 45 degree orientation...?
 * @param point 
 * @param polygon 
 * @returns if the point is inside the polygon
 */
export function isPointInsidePolygon(point: Point, polygon: Point[]) {
    var n = polygon.length;
    if (n < 3) { return false };
    var extremeXPoint = { y: point.y, x: _extreme };
    var intersections = 0;

    let point1, point2
    for (let i = 0; i < polygon.length; i++) {
        point1 = polygon[i]
        point2 = i + 1 >= polygon.length ? polygon[0] : polygon[i + 1]
        if (doLineSegmentsIntersect([point, extremeXPoint], [point1, point2])) { intersections++ }
    }

    return intersections % 2 !== 0
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