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

interface SpriteData {
    id: string
    sequences: {
        [index: string]: SpriteFrame[]
    }
}

export type { SpriteSheet, SpriteFrame, SpriteData }

interface SheetWithFrame {
    sheet: SpriteSheet
    row: number
    col: number
}

export class Sprite {
    private data: SpriteData
    private sheets: SpriteSheet[]
    constructor(data: SpriteData, sheets: SpriteSheet[]) {
        this.data = data
        this.sheets = sheets
    }

    public getFrame(sequence: string, frameIndex: number): SheetWithFrame | undefined {
        const frames = this.data.sequences[sequence]
        if (!frames) { return undefined }
        const frame = frames[frameIndex]
        if (!frame) { return undefined }
        const sheet = this.sheets.find(sheet => sheet.id === frame.sheetId)
        return {
            sheet,
            row: frame.row,
            col: frame.col
        }
    }

    public getStyle(sequence = 'default', frameIndex = 0) {
        const frame = this.getFrame(sequence, frameIndex)
        if (!frame) { return undefined }

        return {
            backgroundImage: `url(${frame.sheet.url})`,
            backgroundPositionX: `${-100 * frame.col}%`,
            backgroundPositionY: `${-100 * frame.row}%`,
            backgroundSize: `${100 * frame.sheet.cols}% ${100 * frame.sheet.rows}%`,
            width: '100%',
            height: '100%',
        }

    }
}
