import { GameDesign, RoomData, Zone, ZoneType, ActorData, ItemData, HotspotZone } from "point-click-lib";
import { findById } from "@/lib/util";
import { ReactNode } from "react";
import { ActorIcon, HotspotIcon, InventoryIcon } from "../material-icons";


const descriptionStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 2,
}

const ActorDescription = ({ data }: { data: ActorData }) => (
    <span style={descriptionStyle}>
        <ActorIcon fontSize="small" />
        <span>{data.id}</span>
    </span>
)

const InventoryItemDescription = ({ data }: { data: ItemData }) => (
    <span style={descriptionStyle}>
        <InventoryIcon fontSize="small" />
        <span>{data.id}</span>
    </span>
)

const HotspotDescription = ({ data, room }: { data: HotspotZone, room: RoomData }) => (
    <span style={descriptionStyle}>
        <HotspotIcon fontSize="small" />
        <span>{data.id}</span>
        <span>({room.id})</span>
    </span>
)


export function getTargetLists(gameDesign: GameDesign, excludeItems = false): { ids: string[]; descriptions: ReactNode[] } {
    const { actors, items, rooms } = gameDesign
    const ids: string[] = [];
    const descriptions: ReactNode[] = [];

    actors.forEach(actor => {
        ids.push(actor.id)
        descriptions.push(<ActorDescription data={actor} />)
    })
    if (!excludeItems) {
        items.forEach(item => {
            ids.push(item.id)
            descriptions.push(<InventoryItemDescription data={item} />)
        })
    }
    rooms.forEach(room => {
        room.hotspots?.forEach(hotspot => {
            ids.push(hotspot.id)
            descriptions.push(<HotspotDescription data={hotspot} room={room} />)
        })
    })
    return { ids, descriptions }
}

export function getActorDescriptions(gameDesign: GameDesign): ReactNode[] {
    const { actors } = gameDesign
    return actors.map(actor => <ActorDescription key={actor.id} data={actor} />)
}

export function getItemDescriptions(gameDesign: GameDesign): ReactNode[] {
    const { items } = gameDesign
    return items.map(item => <InventoryItemDescription key={item.id} data={item} />)
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