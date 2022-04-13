
type BackgroundLayer = {
    url: string,
    parallax: number,
    width?: number,
    height?: number,
}

type Zone = {
    name: string,
    x: number,
    y: number,
    path: string,
    parallax: number,
}

type RoomData = {
    name: string
    frameWidth: number,
    width: number
    height: number
    background: BackgroundLayer[],
    zones: Zone[]
}

export type { RoomData, BackgroundLayer, Zone }