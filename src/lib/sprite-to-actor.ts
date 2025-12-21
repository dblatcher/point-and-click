import { ActorData, Direction } from "point-click-lib"
import { Sprite } from "./Sprite"

export const buildActorData = (sprite: Sprite, animationKey: string, direction: Direction): ActorData => {
    const image = sprite.getFrame(animationKey, 0, direction)?.image
    const widthScale = image?.widthScale || 1
    const heightScale = image?.heightScale || 1

    return {
        type: 'actor',
        id: 'preview',
        x: 50 / widthScale,
        y: 0,
        height: 100 / heightScale,
        width: 100 / widthScale,
        sprite: sprite.id,
        status: animationKey,
        direction
    }
}