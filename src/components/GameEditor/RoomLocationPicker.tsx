import { RoomContentItem } from "@/components/game/types";
import { MarkerShape } from "@/components/svg/MarkerShape";
import { Room } from "@/components/svg/Room";
import { Point, RoomData } from "@/definitions";
import { calculateScreenX, getXShift, locateClickInWorld } from "@/lib/roomFunctions";
import { Box } from "@mui/material";
import { useState } from "react";
import { Pin } from "../svg/Pin";
import Hotspot from "../svg/Room/HotSpot";
import { obstableClassNames, walkableClassNames } from "../svg/Room/zoneCssClasses";
import ZoneSvg from "../svg/ZoneSvg";
import { ViewAngleSlider } from "./RoomEditor/ViewAngleSlider";


interface Props {
    roomData: RoomData,
    contents?: RoomContentItem[],
    targetPoint?: Point,
    subPoints?: Point[],
    viewAngleX?: number,
    viewAngleY?: number,
    previewWidth?: number,
    previewHeight?: number,
    onClick?: { (point: { x: number; y: number }): void };
    renderAllZones?: boolean
    obstacleRefToFocus?: string
    walkableRefToFocus?: string
    hotspotIdToFocus?: string
}

export const RoomLocationPicker = ({
    roomData, contents = [], targetPoint, subPoints,
    viewAngleX: viewAngleXProp, 
    viewAngleY: viewAngleYProp, 
    previewWidth = 600, previewHeight = previewWidth,
    onClick, renderAllZones, obstacleRefToFocus, walkableRefToFocus, hotspotIdToFocus,
}: Props) => {

    const [viewAngleXState, setViewAngleXState] = useState(0)
    const [viewAngleYState, setViewAngleYState] = useState(0)
    const viewAngleX = typeof viewAngleXProp === 'number' ? viewAngleXProp : viewAngleXState;
    const viewAngleY = typeof viewAngleYProp === 'number' ? viewAngleYProp : viewAngleYState;

    const obstacleInFocus = obstacleRefToFocus ? roomData.obstacleAreas?.find(z => z.ref === obstacleRefToFocus) : undefined
    const walkableInFocus = walkableRefToFocus ? roomData.walkableAreas?.find(z => z.ref === walkableRefToFocus) : undefined
    const hotspotInFocus = hotspotIdToFocus ? roomData.hotspots?.find(z => z.id === hotspotIdToFocus) : undefined

    const center = (roomData.frameWidth / 2) + getXShift(viewAngleX, 1, roomData)
    const left = center - roomData.width / 2

    return <Box
        sx={{
            cursor: onClick ? 'crosshair' : 'default',
            position: 'relative',
        }}
    >
        <Room
            data={roomData}
            contents={contents}
            viewAngleX={viewAngleX}
            viewAngleY={viewAngleY}
            renderAllZones={renderAllZones}
            handleRoomClick={(x, y) => {
                if (onClick) {
                    const point = locateClickInWorld(x, y, viewAngleX, roomData)
                    onClick({ x: Math.round(point.x), y: Math.round(point.y) })
                }
            }}
            maxWidth={previewWidth}
            maxHeight={previewHeight}
            noSound={true}
            noMargin={true}
        >

            {subPoints?.map((point, index) => (
                <svg key={index}
                    x={calculateScreenX(point.x, viewAngleX, roomData)}
                    y={roomData.height - point.y}
                    style={{ overflow: 'visible' }}>
                    <Pin label={(index + 1).toString()}  />
                </svg>
            ))}

            {targetPoint && (
                <MarkerShape
                    roomData={roomData}
                    viewAngleX={viewAngleX}
                    color={'red'}
                    {...targetPoint}
                />
            )}

            {obstacleInFocus && (
                <ZoneSvg
                    className={obstableClassNames({ blink: true })}
                    stopPropagation={false}
                    zone={obstacleInFocus}
                    x={obstacleInFocus.x + left}
                    y={roomData.height - obstacleInFocus.y}
                />
            )}
            {walkableInFocus && (
                <ZoneSvg
                    className={walkableClassNames({ blink: true })}
                    stopPropagation={false}
                    zone={walkableInFocus}
                    x={walkableInFocus.x + left}
                    y={roomData.height - walkableInFocus.y}
                />
            )}
            {hotspotInFocus && (
                <Hotspot
                    zone={hotspotInFocus}
                    viewAngleX={viewAngleX}
                    viewAngleY={0}
                    roomData={roomData}
                    flash={true}
                />
            )}
        </Room>
        {typeof viewAngleXProp === 'undefined' && (
            <ViewAngleSlider viewAngle={viewAngleXState} setViewAngle={setViewAngleXState} />
        )}
        {typeof viewAngleYProp === 'undefined' && (
            <ViewAngleSlider viewAngle={viewAngleYState} setViewAngle={setViewAngleYState} />
        )}
    </Box>
}