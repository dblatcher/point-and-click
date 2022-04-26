import { Polygon } from "./Polygon"

interface Zone {
    type: 'hotspot',
    x: number,
    y: number,
    path?: string,
    polygon?: Polygon,
    circle?: number,
    rect?: [number, number]
}

interface HotSpotZone extends Zone {
    id: string,
    name?: string,
    parallax: number,
}

export type { Zone, HotSpotZone }