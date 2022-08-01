import { GameDesign } from "src";

const emoji = {
    CHARACTER: '🚶',
    ITEM: '📦',
    HOTSPOT: '🎯',
    CONVERSATION: '💬',
    SEQUENCE:'📜',
}

export function getTargetLists(gameDesign: GameDesign): { ids: string[]; descriptions: string[] } {
    const { characters, items, rooms } = gameDesign
    const ids: string[] = [];
    const descriptions: string[] = [];

    characters.forEach(character => {
        ids.push(character.id)
        descriptions.push(`${emoji.CHARACTER} ${character.id}`)
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

export function getCharacterDescriptions(gameDesign: GameDesign): string[] {
    const { characters } = gameDesign
    return characters.map(character => `${emoji.CHARACTER} ${character.id}`)
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