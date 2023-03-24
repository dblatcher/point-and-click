import { SupportedZoneShape } from "@/oldsrc"

export type NewObstableEffect = {
    type: 'OBSTACLE';
    shape: SupportedZoneShape;
}

export type NewWalkableEffect = {
    type: 'WALKABLE';
    shape: SupportedZoneShape;
}

export type NewHotspotEffect = {
    type: 'HOTSPOT';
    shape: SupportedZoneShape;
}

export type NewObstaclePolygonPointEffect = {
    type: 'POLYGON_POINT_OBSTACLE';
    index: number;
}

export type NewWalkablePolygonPointEffect = {
    type: 'POLYGON_POINT_WALKABLE';
    index: number;
}

export type NewHotspotPolygonPointEffect = {
    type: 'POLYGON_POINT_HOTSPOT';
    index: number;
}

export type HotspotWalkToPoint = {
    type: 'HOTSPOT_WALKTO_POINT';
    index: number;
}

export type ClickEffect = NewObstableEffect |
    NewObstaclePolygonPointEffect |
    NewHotspotEffect |
    NewHotspotPolygonPointEffect |
    NewWalkableEffect |
    NewWalkablePolygonPointEffect |
    HotspotWalkToPoint
