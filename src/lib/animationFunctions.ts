import { ActorData, DEFAULT_ANIMATION, SpriteData } from "point-click-lib";
import { deduplicateStringArray, findById } from "./util";

export function getStatusSuggestions(actorId: string | undefined, gameDesign: { actors: ActorData[]; sprites: SpriteData[] }): string[] {
    const actorData = findById(actorId, gameDesign.actors)
    const soundEffectStatus = Object.keys(actorData?.soundEffectMap || {})
    const spriteData = findById(actorData?.sprite, gameDesign.sprites)
    const spriteAnimations = Object.keys(spriteData?.animations || [])
    const defaultAnimations = Object.values(DEFAULT_ANIMATION)
    return deduplicateStringArray([...spriteAnimations, ...soundEffectStatus, ...defaultAnimations])
}
