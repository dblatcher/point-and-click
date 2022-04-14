
type BackgroundLayer = {
    url: string,
    parallax: number,
    height?: number,
}

type Zone = {
    name: string,
    x: number,
    y: number,
    parallax: number,
    path?: string,
    circle?: number,
    rect?: [number, number]
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