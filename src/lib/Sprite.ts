import { SpriteSheet, SpriteData, Direction, SpriteFrame } from "../definitions/SpriteSheet"
import spriteSheetService from "../services/spriteSheetService";
import imageService from "../services/imageService";


interface SheetWithFrame {
    sheet: SpriteSheet
    row: number
    col: number
}

export class Sprite {
    readonly data: SpriteData
    constructor(data: SpriteData) {
        this.data = data
    }

    readonly DEFAULT_ANIMATIONS = {
        talk: 'talk',
        move: 'walk',
        wait: 'default',
        act: 'default',
    }

    public get id() {
        return this.data.id
    }

    public hasAnimation(animationName: string | undefined): boolean {
        if (!animationName) { return false }
        const { animations } = this.data
        return !!animations[animationName]
    }

    public getFrames(animationName: string, direction: Direction = this.data.defaultDirection): SpriteFrame[] | undefined {
        const animationObject = this.data.animations[animationName]
        if (!animationObject) { return undefined }
        const directionToUse = !direction || !animationObject[direction] ? this.data.defaultDirection : direction;
        return animationObject[directionToUse]
    }


    public getFrame(animationName: string, frameIndex: number, direction: Direction = this.data.defaultDirection): SheetWithFrame | undefined {

        const frames = this.getFrames(animationName, direction);
        if (!frames) { return undefined }

        const frame = frames[frameIndex]

        if (!frame) { return undefined }
        const sheet = spriteSheetService.get(frame.sheetId)
        if (!sheet) { return undefined }
        return {
            sheet,
            row: frame.row,
            col: frame.col
        }
    }

    public getFrameScale(animationName = 'default', frameIndex = 0, direction?: Direction): [number, number] {
        const frame = this.getFrame(animationName, frameIndex, direction) || this.getFrame('default', 0, this.data.defaultDirection)
        if (!frame) { return [1, 1] }
        return [frame.sheet.widthScale || 1, frame.sheet.heightScale || 1]
    }

    public getStyle(animationName = 'default', frameIndex = 0, direction?: Direction) {
        const frame = this.getFrame(animationName, frameIndex, direction) || this.getFrame('default', 0, this.data.defaultDirection)
        if (!frame) { return {} }
        const href = imageService.get(frame.sheet.imageId)?.href

        return {
            backgroundImage: `url(${href})`,
            backgroundPositionX: `${-100 * frame.col}%`,
            backgroundPositionY: `${-100 * frame.row}%`,
            backgroundSize: `${100 * frame.sheet.cols}% ${100 * frame.sheet.rows}%`,
            width: '100%',
            height: '100%',
            filter: undefined
        }

    }
}
