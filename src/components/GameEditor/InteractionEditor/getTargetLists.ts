import { GameDesign, ZoneType, RoomData, Zone } from "@/definitions";
import { findById } from "@/lib/util";

const emoji = {
    ACTOR: '🚶',
    ITEM: '📦',
    HOTSPOT: '🎯',
    CONVERSATION: '💬',
    SEQUENCE: '📜',
}

export function getTargetLists(gameDesign: GameDesign, excludeItems = false): { ids: string[]; descriptions: string[] } {
    const { actors, items, rooms } = gameDesign
    const ids: string[] = [];
    const descriptions: string[] = [];

    actors.forEach(actor => {
        ids.push(actor.id)
        descriptions.push(`${emoji.ACTOR} ${actor.id}`)
    })
    if (!excludeItems) {
        items.forEach(item => {
            ids.push(item.id)
            descriptions.push(`${emoji.ITEM} ${item.id}`)
        })
    }
    rooms.forEach(room => {
        room.hotspots?.forEach(hotspot => {
            ids.push(hotspot.id)
            descriptions.push(`${emoji.HOTSPOT}${hotspot.id} (${room.id})`)
        })
    })
    return { ids, descriptions }
}

export function getActorDescriptions(gameDesign: GameDesign): string[] {
    const { actors } = gameDesign
    return actors.map(actor => `${emoji.ACTOR} ${actor.id}`)
}

export function getItemDescriptions(gameDesign: GameDesign): string[] {
    const { items } = gameDesign
    return items.map(item => `${emoji.ITEM} ${item.id}`)
}

export function getConversationsDescriptions(gameDesign: GameDesign): string[] {
    const { conversations = [] } = gameDesign
    return conversations.map(item => `${emoji.CONVERSATION} ${item.id}`)
}

export function getSequenceDescriptions(gameDesign: GameDesign): string[] {
    const { sequences = [] } = gameDesign
    return sequences.map(item => `${emoji.SEQUENCE} ${item.id}`)
}

const getZones = (room: RoomData, zoneType: ZoneType): Zone[] => {
    switch (zoneType) {
        case 'hotspot':
            return room.hotspots || []
        case 'walkable':
            return room.walkableAreas || []
        case 'obstacle':
            return room.obstacleAreas || []
    }
}

export function getZoneRefsOrIds(gameDesign: GameDesign, roomId?: string, zoneType?: ZoneType): string[] {
    if (!roomId || !zoneType) {
        return []
    }
    const { rooms = [] } = gameDesign
    const room = findById(roomId, rooms)
    if (!room) { return [] }

    if (zoneType === 'hotspot') {
        return room.hotspots?.map(hotspot => hotspot.id) || []
    }
    const refs = getZones(room, zoneType)
        .map(zone => zone.ref)
        .filter(ref => typeof ref === 'string' && ref.length > 0)

    return refs as string[]
}