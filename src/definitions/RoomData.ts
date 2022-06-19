import { HotspotZone, Zone } from "./Zone"

type BackgroundLayer = {
    url: string;
    parallax: number;
}

type ScaleLevel = [number, number][]

type RoomData = {
    name: string;
    frameWidth: number;
    width: number;
    height: number;
    background: BackgroundLayer[];
    hotspots?: HotspotZone[];
    obstacleAreas?: Zone[];
    scaling?: ScaleLevel;
}

export type { RoomData, BackgroundLayer, ScaleLevel }