
type BackgroundLayer = {
    url: string,
    parallax: number,
    width?: number,
    height?: number,
}


type RoomData = {
    name: string
    frameWidth:number,
    width: number
    height: number
    background: BackgroundLayer[]
}

export type { RoomData, BackgroundLayer}