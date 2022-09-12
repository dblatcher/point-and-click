import { ActorData, SpriteData } from "src"
import { Sprite } from "./Sprite"
import { findById } from "./util"


export function getAnimationSuggestions(actorId: string, gameDesign: { actors: ActorData[]; sprites: SpriteData[] }): string[] {
    const actorData = findById(actorId, gameDesign.actors)
    const spriteData = findById(actorData?.sprite, gameDesign.sprites)
    if (!spriteData) {
        return []
    }

    const spriteAnimations = Object.keys(spriteData.animations)
    const defaultAnimations = Object.values(Sprite.DEFAULT_ANIMATION).filter(value => !spriteAnimations.includes(value))
    return [...spriteAnimations, ...defaultAnimations]
}
