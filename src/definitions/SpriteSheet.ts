interface SpriteSheet {
    id: string
    url: string
    rows: number
    cols: number
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
    sequences: {
        [index: string]: {
            left?: SpriteFrame[]
            right?: SpriteFrame[]
        }
    }
}

export type { SpriteSheet, SpriteFrame, SpriteData, Direction }


