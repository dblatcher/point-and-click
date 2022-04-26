import { SpriteSheet, SpriteData, Direction, SpriteFrame } from "../definitions/SpriteSheet"


interface SheetWithFrame {
    sheet: SpriteSheet
    row: number
    col: number
}

export class Sprite {
    readonly data: SpriteData
    readonly sheets: SpriteSheet[]
    constructor(data: SpriteData, sheets: SpriteSheet[]) {
        this.data = data
        this.sheets = sheets
    }

    public getFrames(sequence: string, direction: Direction): SpriteFrame[] | undefined {
        const sequenceObject = this.data.sequences[sequence]
        if (!sequenceObject) { return undefined }
        const directionToUse = !direction || !sequenceObject[direction] ? this.data.defaultDirection : direction;
        return sequenceObject[directionToUse]
    }


    public getFrame(sequence: string, frameIndex: number, direction: Direction): SheetWithFrame | undefined {

        const frames = this.getFrames(sequence, direction);
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

    public getStyle(sequence = 'default', frameIndex = 0, direction?: Direction) {
        const frame = this.getFrame(sequence, frameIndex, direction) || this.getFrame('default', 0,  this.data.defaultDirection)
        if (!frame) { return {} }

        return {
            backgroundImage: `url(${frame.sheet.url})`,
            backgroundPositionX: `${-100 * frame.col}%`,
            backgroundPositionY: `${-100 * frame.row}%`,
            backgroundSize: `${100 * frame.sheet.cols}% ${100 * frame.sheet.rows}%`,
            width: '100%',
            height: '100%',
            filter: undefined
        }

    }
}
