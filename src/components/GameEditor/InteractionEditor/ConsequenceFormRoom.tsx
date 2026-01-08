import { useGameDesign } from "@/context/game-design-context";
import { XY } from "@/lib/types-and-constants";
import { findById } from "@/lib/util";
import { Box, Typography } from "@mui/material";
import { AnyConsequence, Consequence, HotspotZone, RoomData, Zone, getTargetPoint, getViewAngleXCenteredOn, getViewAngleYCenteredOn } from "point-click-lib";
import React from "react";
import { RoomLocationPicker } from "../RoomLocationPicker";

interface Props {
    consequence: Consequence
    setPoint: { (point: XY): void };
}

const getZone = (consequence: Consequence, roomData?: RoomData): Zone | undefined => {
    if (consequence.type !== 'toggleZone' || !consequence.ref || !roomData) {
        return undefined
    }
    const hotspot = roomData.hotspots?.find(zone => zone.id === consequence.ref)
    const obstacle = roomData.obstacleAreas?.find(zone => zone.ref === consequence.ref);
    const walkable = roomData.walkableAreas?.find(zone => zone.ref === consequence.ref);
    return hotspot ?? obstacle ?? walkable
}

export const ConsequenceFormRoom: React.FunctionComponent<Props> = ({ consequence, setPoint }: Props) => {
    const { gameDesign } = useGameDesign()
    const { roomId } = consequence as AnyConsequence;
    const roomData = findById(roomId, gameDesign.rooms);
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

    const fixedView = {
        x: typeof zoneX === 'number' ? getViewAngleXCenteredOn(zoneX, roomData) : 0,
        y: typeof zoneY === 'number' ? getViewAngleYCenteredOn(zoneY, roomData) : 0
    }

    switch (consequence.type) {
        case "changeRoom":
        case "teleportActor":
            return <RoomLocationPicker
                roomData={roomData}
                renderAllZones={true}
                previewWidth={300}
                targetPoint={{ x: consequence.x ?? 0, y: consequence.y ?? 0 }}
                onClick={setPoint}
            />
        case "toggleZone":
            return <RoomLocationPicker
                fixedView={fixedView}
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