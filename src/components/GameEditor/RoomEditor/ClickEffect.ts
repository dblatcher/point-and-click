import { SupportedZoneShape, ZoneType } from "@/definitions"
import { createContext, useContext } from "react";

type NewAreaEffect = {
    type: 'ADD_NEW'
    shape: SupportedZoneShape;
    zoneType: ZoneType;
}

type AddPolygonPointEffect = {
    type: 'ADD_POLYGON_POINT';
    zoneType: ZoneType;
    index: number;
}

type HotspotWalkToPoint = {
    type: 'HOTSPOT_WALKTO_POINT';
    index: number;
    zoneType?: 'hotspot',
}

type ZonePosition = {
    type: 'ZONE_POSITION'
    index: number;
    zoneType: ZoneType;
}

type MovePolygonPoint = {
    type: 'MOVE_POLYGON_POINT'
    index: number
    zoneType: ZoneType;
    pointIndex: number;
}

export type ClickEffect =
    AddPolygonPointEffect |
    HotspotWalkToPoint |
    ZonePosition | MovePolygonPoint | NewAreaEffect

export const RoomClickContext = createContext<{ clickEffect?: ClickEffect, setClickEffect: { (clickEffect?: ClickEffect): void } }>({
    clickEffect: undefined,
    setClickEffect(clickEffect) {
        return
    },
})

export const useRoomClickEffect = () => useContext(RoomClickContext)

