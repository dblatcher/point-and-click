import { Polygon } from "./Polygon"

interface Zone  {
    x: number,
    y: number,
    path?: string,
    polygon?: Polygon,
    circle?: number,
    rect?: [number, number]
}

interface HotSpotZone extends Zone {
    name: string,
    parallax: number,
}

export type { Zone, HotSpotZone }