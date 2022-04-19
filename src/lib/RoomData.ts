import { HotSpotZone, Zone } from "./Zone"

type BackgroundLayer = {
    url: string,
    parallax: number,
    width?: number,
    height?: number,
    x?:number,
}

type RoomData = {
    name: string
    frameWidth: number,
    width: number
    height: number
    background: BackgroundLayer[],
    hotspots?: HotSpotZone[],
    obstacleAreas?: Zone[]
}

export type { RoomData, BackgroundLayer }