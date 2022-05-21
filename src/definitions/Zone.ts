import { Ident } from './BaseTypes'

type SupportedZoneShape = 'rect' | 'circle' | 'polygon'
type Polygon = [number, number][];


interface Zone {
    x: number,
    y: number,
    path?: string,
    polygon?: Polygon,
    circle?: number,
    rect?: [number, number]
}

type HotSpotZone = Ident & Zone & {
    type: 'hotspot',
    parallax: number,
}

export type { Zone, HotSpotZone, Polygon, SupportedZoneShape }