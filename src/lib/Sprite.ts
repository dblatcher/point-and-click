import { SpriteData, Direction, SpriteFrame, Animation } from "../definitions/SpriteSheet"
import { ImageAsset } from "@/services/assets";
import { getBackgroundStyle } from "./image-frame-backgrounds";


interface ImageWithFrame {
    image: ImageAsset,
    row: number
    col: number
}

export class Sprite {
    readonly data: SpriteData
    getImageAsset: { (id: string): ImageAsset | undefined }
    constructor(data: SpriteData, getImage: { (id: string): ImageAsset | undefined }) {
        this.data = data
        this.getImageAsset = getImage
    }

    static readonly DEFAULT_ANIMATION = {
        say: 'talk',
        move: 'walk',
        goTo: 'walk',
        wait: 'default',
        act: 'default',
    } as const

    public get id() {
        return this.data.id
    }

    public hasAnimation(animationName: string | undefined): boolean {
        if (!animationName) { return false }
        const { animations } = this.data
        return !!animations[animationName]
    }

    public getAnimation(animationName?: string, type?: 'say' | 'move' | 'wait' | 'act'): Animation {
        const { animations } = this.data
        if (animationName && this.hasAnimation(animationName)) { return animations[animationName] }
        if (type && this.hasAnimation(Sprite.DEFAULT_ANIMATION[type])) { return animations[Sprite.DEFAULT_ANIMATION[type]] }
        return {}
    }

    public getFrames(animationName: string, direction: Direction = this.data.defaultDirection): SpriteFrame[] | undefined {
        const animationObject = this.data.animations[animationName]
        if (!animationObject) { return undefined }
        const directionToUse = !direction || !animationObject[direction] ? this.data.defaultDirection : direction;
        return animationObject[directionToUse]
    }


    public getFrame(animationName: string, frameIndex: number, direction: Direction = this.data.defaultDirection): ImageWithFrame | undefined {

        const frames = this.getFrames(animationName, direction);
        if (!frames) { return undefined }

        const frame = frames[frameIndex]

        if (!frame) { return undefined }
        const imageAsset = this.getImageAsset(frame.imageId)
        if (!imageAsset) { return undefined }
        return {
            image: imageAsset,
            row: frame.row,
            col: frame.col
        }
    }

    public getFrameScale(animationName = 'default', frameIndex = 0, direction?: Direction): [number, number] {
        const frame = this.getFrame(animationName, frameIndex, direction) || this.getFrame('default', 0, this.data.defaultDirection)
        if (!frame) { return [1, 1] }
        return [frame.image?.widthScale || 1, frame.image?.heightScale || 1]
    }

    public getStyle(animationName = 'default', frameIndex = 0, direction?: Direction) {
        const frame = this.getFrame(animationName, frameIndex, direction) || this.getFrame('default', 0, this.data.defaultDirection)
        if (!frame) { return {} }
        return getBackgroundStyle(frame.image, frame.col, frame.row)
    }
}
