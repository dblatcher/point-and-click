import { Polygon } from "./Polygon"

type Zone = {
    name: string,
    x: number,
    y: number,
    parallax: number,
    path?: string,
    polygon?: Polygon,
    circle?: number,
    rect?: [number, number]
}

export type { Zone }