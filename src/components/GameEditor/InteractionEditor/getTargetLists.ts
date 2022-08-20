import { GameDesign } from "src";

const emoji = {
    ACTOR: '🚶',
    ITEM: '📦',
    HOTSPOT: '🎯',
    CONVERSATION: '💬',
    SEQUENCE:'📜',
}

export function getTargetLists(gameDesign: GameDesign): { ids: string[]; descriptions: string[] } {
    const { actors: actors, items, rooms } = gameDesign
    const ids: string[] = [];
    const descriptions: string[] = [];

    actors.forEach(actor => {
        ids.push(actor.id)
        descriptions.push(`${emoji.ACTOR} ${actor.id}`)
    })
    items.forEach(item => {
        ids.push(item.id)
        descriptions.push(`${emoji.ITEM} ${item.id}`)
    })
    rooms.forEach(room => {
        room.hotspots?.forEach(hotspot => {
            ids.push(hotspot.id)
            descriptions.push(`${emoji.HOTSPOT}${hotspot.id} (${room.id})`)
        })
    })
    return { ids, descriptions }
}

export function getActorDescriptions(gameDesign: GameDesign): string[] {
    const { actors: actors } = gameDesign
    return actors.map(actor => `${emoji.ACTOR} ${actor.id}`)
}

export function getItemDescriptions(gameDesign: GameDesign): string[] {
    const { items } = gameDesign
    return items.map(item => `${emoji.ITEM} ${item.id}`)
}

export function getConversationsDescriptions(gameDesign: GameDesign): string[] {
    const { conversations=[] } = gameDesign
    return conversations.map(item => `${emoji.CONVERSATION} ${item.id}`)
}

export function getSequenceDescriptions(gameDesign: GameDesign): string[] {
    const { sequences = [] } = gameDesign
    return sequences.map(item=> `${emoji.SEQUENCE} ${item.id}`)
}