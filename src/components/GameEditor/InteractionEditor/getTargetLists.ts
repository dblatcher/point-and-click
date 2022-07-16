import { GameDesign } from "../../../definitions/Game";

export function getTargetLists(gameDesign: GameDesign): { ids: string[]; descriptions: string[] } {
    const { characters, items, rooms } = gameDesign
    const ids: string[] = [];
    const descriptions: string[] = [];

    characters.forEach(character => {
        ids.push(character.id)
        descriptions.push(`🚶 ${character.id}`)
    })
    items.forEach(item => {
        ids.push(item.id)
        descriptions.push(`🎒 ${item.id}`)
    })
    rooms.forEach(room => {
        room.hotspots?.forEach(hotspot => {
            ids.push(hotspot.id)
            descriptions.push(`⌘${hotspot.id} (${room.id})`)
        })
    })
    return { ids, descriptions }
}