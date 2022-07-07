import { HotspotZone, Zone } from "./Zone"

type BackgroundLayer = {
    parallax: number;
    imageId: string;
}

type ScaleLevel = [number, number][]

type RoomData = {
    id: string;
    frameWidth: number;
    width: number;
    height: number;
    background: BackgroundLayer[];
    hotspots?: HotspotZone[];
    obstacleAreas?: Zone[];
    scaling?: ScaleLevel;
}

export type { RoomData, BackgroundLayer, ScaleLevel }