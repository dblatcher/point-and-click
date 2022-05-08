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

    readonly DEFAULT_ANIMATIONS = {
        talk: 'talk',
        move: 'walk',
        wait: 'default',
        act: 'default',
    }

    public hasAnimation(animationName: string | undefined): boolean {
        if (!animationName) { return false }
        const { animations } = this.data
        return !!animations[animationName]
    }

    public getFrames(animationName: string, direction: Direction): SpriteFrame[] | undefined {
        const animationObject = this.data.animations[animationName]
        if (!animationObject) { return undefined }
        const directionToUse = !direction || !animationObject[direction] ? this.data.defaultDirection : direction;
        return animationObject[directionToUse]
    }


    public getFrame(animationName: string, frameIndex: number, direction: Direction): SheetWithFrame | undefined {

        const frames = this.getFrames(animationName, direction);
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

    public getStyle(animationName = 'default', frameIndex = 0, direction?: Direction) {
        const frame = this.getFrame(animationName, frameIndex, direction) || this.getFrame('default', 0, this.data.defaultDirection)
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
