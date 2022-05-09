interface SpriteSheet {
    id: string
    url: string
    rows: number
    cols: number
    widthScale?:number
    heightScale?:number
}


interface SpriteFrame {
    sheetId: string
    row: number
    col: number
}

type Direction = 'left' | 'right'

interface SpriteData {
    id: string
    defaultDirection: Direction
    animations: Record<string, {
        left?: SpriteFrame[]
        right?: SpriteFrame[]
    }>
}

export type { SpriteSheet, SpriteFrame, SpriteData, Direction }


