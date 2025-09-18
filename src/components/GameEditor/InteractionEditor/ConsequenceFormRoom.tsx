import { useGameDesign } from "@/context/game-design-context";
import { AnyConsequence, Consequence, HotspotZone, RoomData, Zone } from "@/definitions";
import { getTargetPoint, getViewAngleXCenteredOn, getViewAngleYCenteredOn } from "@/lib/roomFunctions";
import { findById } from "@/lib/util";
import { Box, Typography } from "@mui/material";
import React from "react";
import { RoomLocationPicker } from "../RoomLocationPicker";

interface Props {
    consequence: AnyConsequence
    update: { (consequence: Consequence): void };
}

const getZone = (consequence: AnyConsequence, roomData?: RoomData): Zone | undefined => {
    const { type, ref } = consequence
    if (type !== 'toggleZone' || !ref || !roomData) {
        return undefined
    }
    const hotspot = roomData.hotspots?.find(zone => zone.id === ref)
    const obstacle = roomData.obstacleAreas?.find(zone => zone.ref === ref);
    const walkable = roomData.walkableAreas?.find(zone => zone.ref === ref);
    return hotspot ?? obstacle ?? walkable
}

export const ConsequenceFormRoom: React.FunctionComponent<Props> = ({ consequence, update }: Props) => {
    const { gameDesign } = useGameDesign()
    const roomData = findById(consequence.roomId, gameDesign.rooms);
    if (!roomData) {
        return (
            <Box sx={{
                width: 300,
                height: 200,
                border: '1px dotted',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Typography>
                    [no roomId selected]
                </Typography>
            </Box>
        )
    }

    const zone = getZone(consequence, roomData)
    const zoneX = zone ? zone?.type === 'hotspot' ? getTargetPoint(zone as HotspotZone, roomData).x : zone.x : undefined
    const zoneY = zone ? zone?.type === 'hotspot' ? getTargetPoint(zone as HotspotZone, roomData).y : zone.y : undefined

    switch (consequence.type) {
        case "changeRoom":
        case "teleportActor":
            return <RoomLocationPicker
                roomData={roomData}
                renderAllZones={true}
                previewWidth={300}
                targetPoint={{ x: consequence.x ?? 0, y: consequence.y ?? 0 }}
                onClick={point => update({ ...consequence, ...point })}
            />
        case "toggleZone":
            return <RoomLocationPicker
                viewAngleX={typeof zoneX === 'number' ? getViewAngleXCenteredOn(zoneX, roomData) : 0}
                viewAngleY={typeof zoneY === 'number' ? getViewAngleYCenteredOn(zoneY, roomData) : 0}
                roomData={roomData}
                previewWidth={300}
                obstacleRefToFocus={consequence.zoneType === 'obstacle' ? consequence.ref : undefined}
                walkableRefToFocus={consequence.zoneType === 'walkable' ? consequence.ref : undefined}
                hotspotIdToFocus={consequence.zoneType === 'hotspot' ? consequence.ref : undefined}
            />
        default:
            return null
    }
}