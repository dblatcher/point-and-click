import { type Ident } from './BaseTypes'

export type SupportedZoneShape = 'rect' | 'circle' | 'polygon'
export type Polygon = [number, number][];

export interface Zone {
    type?: string;
    x: number;
    y: number;
    path?: string;
    polygon?: Polygon;
    circle?: number;
    rect?: [number, number];
}

export type HotspotZone = Ident & Zone & {
    type: 'hotspot';
    parallax: number;
}

