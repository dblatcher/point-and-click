import { SupportedZoneShape } from "../../../definitions/Zone"

export type NewObstableEffect = {
    type: 'OBSTACLE',
    shape: SupportedZoneShape
}

export type NewHotspotEffect = {
    type: 'HOTSPOT',
    shape: SupportedZoneShape
}

export type NewObstaclePolygonPointEffect = {
    type: 'POLYGON_POINT_OBSTACLE';
    index: number;
}

export type NewHotspotPolygonPointEffect = {
    type: 'POLYGON_POINT_HOTSPOT';
    index: number;
}

export type ClickEffect = NewObstableEffect | NewObstaclePolygonPointEffect | NewHotspotEffect | NewHotspotPolygonPointEffect
