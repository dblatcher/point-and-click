import { ActorData, SpriteData } from "point-click-lib"
import { Sprite } from "./Sprite"
import { findById, deduplicateStringArray } from "./util"


export function getStatusSuggestions(actorId: string | undefined, gameDesign: { actors: ActorData[]; sprites: SpriteData[] }): string[] {
    const actorData = findById(actorId, gameDesign.actors)
    const soundEffectStatus = Object.keys(actorData?.soundEffectMap || {})
    const spriteData = findById(actorData?.sprite, gameDesign.sprites)
    const spriteAnimations = Object.keys(spriteData?.animations || [])
    const defaultAnimations = Object.values(Sprite.DEFAULT_ANIMATION)
    return deduplicateStringArray([...spriteAnimations, ...soundEffectStatus, ...defaultAnimations])
}
