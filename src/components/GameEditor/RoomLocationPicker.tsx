import { ActorWithOrdersAndClickHandlers } from "@/components/game/types";
import { MarkerShape } from "@/components/svg/MarkerShape";
import { Room } from "@/components/svg/Room";
import { Point, RoomData } from "point-click-lib";
import { locateClickInWorld } from "@/lib/roomFunctions";
import { Box } from "@mui/material";
import { useState } from "react";
import { Pin } from "../svg/Pin";
import Hotspot from "../svg/Room/HotSpot";
import { WalkableOrObstacle } from "../svg/Room/WalkableOrObstance";
import { RoomAngleFrame } from "./RoomEditor/RoomAngleFrame";


interface Props {
    roomData: RoomData,
    contents?: ActorWithOrdersAndClickHandlers[],
    targetPoint?: Point,
    subPoints?: Point[],
    previewWidth?: number,
    previewHeight?: number,
    onClick?: { (point: { x: number; y: number }): void };
    renderAllZones?: boolean
    obstacleRefToFocus?: string
    walkableRefToFocus?: string
    hotspotIdToFocus?: string
    fixedView?: { x: number, y: number }
}

export const RoomLocationPicker = ({
    roomData, contents = [], targetPoint, subPoints,
    previewWidth = 600, previewHeight = previewWidth,
    onClick, renderAllZones, obstacleRefToFocus, walkableRefToFocus, hotspotIdToFocus,
    fixedView,
}: Props) => {

    const [viewAngleXState, setViewAngleXState] = useState(0)
    const [viewAngleYState, setViewAngleYState] = useState(0)
    const viewAngleX = fixedView?.x ?? viewAngleXState;
    const viewAngleY = fixedView?.y ?? viewAngleYState;

    const obstacleInFocus = obstacleRefToFocus ? roomData.obstacleAreas?.find(z => z.ref === obstacleRefToFocus) : undefined
    const walkableInFocus = walkableRefToFocus ? roomData.walkableAreas?.find(z => z.ref === walkableRefToFocus) : undefined
    const hotspotInFocus = hotspotIdToFocus ? roomData.hotspots?.find(z => z.id === hotspotIdToFocus) : undefined

    const renderedRoom = <Room
        data={roomData}
        orderedActors={contents}
        viewAngleX={viewAngleX}
        viewAngleY={viewAngleY}
        renderAllZones={renderAllZones}
        handleRoomClick={(x, y) => {
            if (onClick) {
                const point = locateClickInWorld(x, y, viewAngleX, viewAngleY, roomData)
                onClick({ x: Math.round(point.x), y: Math.round(point.y) })
            }
        }}
        maxWidth={previewWidth}
        maxHeight={previewHeight}
        noSound={true}
        noMargin={true}
        surfaceContent={<>
            {targetPoint && (
                <MarkerShape {...targetPoint} />
            )}
            {subPoints?.map((point, index) => (
                <svg key={index}
                    x={point.x}
                    y={roomData.height - point.y}
                    style={{ overflow: 'visible' }}>
                    <Pin label={(index + 1).toString()} />
                </svg>
            ))}
        </>}
        parallaxContent={<>
            {obstacleInFocus && (
                <WalkableOrObstacle
                    zone={obstacleInFocus}
                    zoneType="obstacle"
                    zoneOptions={{ blink: true }}
                    markVertices={false}
                />
            )}
            {walkableInFocus && (
                <WalkableOrObstacle
                    zone={walkableInFocus}
                    zoneType="walkable"
                    zoneOptions={{ blink: true }}
                    markVertices={false}
                />
            )}
            {hotspotInFocus && (
                <Hotspot
                    zone={hotspotInFocus}
                    flash={true}
                />
            )}
        </>}
    />


    return <Box
        sx={{
            cursor: onClick ? 'crosshair' : 'default',
        }}
    >
        {fixedView
            ? (
                <section style={{ position: 'relative', display: 'inline-block' }}>
                    {renderedRoom}
                </section>
            )
            : (
                <RoomAngleFrame roomData={roomData}
                    viewAngleX={viewAngleXState}
                    viewAngleY={viewAngleYState}
                    setViewAngleX={setViewAngleXState}
                    setViewAngleY={setViewAngleYState}>
                    {renderedRoom}
                </RoomAngleFrame>
            )
        }
    </Box>
}