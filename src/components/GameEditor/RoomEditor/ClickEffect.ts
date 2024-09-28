import { SupportedZoneShape, ZoneType } from "@/definitions"
import { createContext, useContext } from "react";

export type NewAreaEffect = {
    type: 'ADD_NEW'
    shape: SupportedZoneShape;
    zoneType: ZoneType;
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

export type ZonePosition = {
    type: 'ZONE_POSITION'
    index: number;
    zoneType: ZoneType;
}

export type MovePolygonPoint = {
    type: 'MOVE_POLYGON_POINT'
    index: number
    zoneType: ZoneType;
    pointIndex: number;
}

export type ClickEffect =
    NewObstaclePolygonPointEffect |
    NewHotspotPolygonPointEffect |
    NewWalkablePolygonPointEffect |
    HotspotWalkToPoint |
    ZonePosition | MovePolygonPoint | NewAreaEffect

export const RoomClickContext = createContext<{ clickEffect?: ClickEffect, setClickEffect: { (clickEffect?: ClickEffect): void } }>({
    clickEffect: undefined,
    setClickEffect(clickEffect) {
        return
    },
})

export const useRoomClickEffect = () => useContext(RoomClickContext)

