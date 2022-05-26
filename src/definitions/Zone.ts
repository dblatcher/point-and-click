import { Ident } from './BaseTypes'

type SupportedZoneShape = 'rect' | 'circle' | 'polygon'
type Polygon = [number, number][];


interface Zone {
    type?: string;
    x: number;
    y: number;
    path?: string;
    polygon?: Polygon;
    circle?: number;
    rect?: [number, number];
}

type HotspotZone = Ident & Zone & {
    type: 'hotspot';
    parallax: number;
}

export type { Zone, HotspotZone, Polygon, SupportedZoneShape }