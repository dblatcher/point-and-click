import { RoomContentItem } from "@/components/game";
import { MarkerShape } from "@/components/svg/MarkerShape";
import { Room } from "@/components/svg/Room";
import { Point, RoomData } from "@/definitions";
import { getShift, locateClickInWorld } from "@/lib/roomFunctions";
import { Box } from "@mui/material";
import { useState } from "react";
import { ViewAngleSlider } from "./RoomEditor/ViewAngleSlider";
import ZoneSvg from "../svg/ZoneSvg";
import Hotspot from "../svg/Room/HotSpot";
import { obstableClassNames, walkableClassNames } from "../svg/Room/zoneCssClasses";


interface Props {
    roomData: RoomData,
    contents?: RoomContentItem[],
    targetPoint?: Point,
    viewAngle?: number,
    previewWidth?: number,
    previewHeight?: number,
    onClick?: { (point: { x: number; y: number }): void };
    showObstacleAreas?: boolean
    obstacleRefToFocus?: string
    walkableRefToFocus?: string
    hotspotIdToFocus?: string
}

export const RoomLocationPicker = ({
    roomData, contents = [], targetPoint,
    viewAngle: viewAngleProp, previewWidth = 600, previewHeight = previewWidth,
    onClick, showObstacleAreas, obstacleRefToFocus, walkableRefToFocus, hotspotIdToFocus,
}: Props) => {

    const [viewAngleState, setViewAngleState] = useState(0)
    const viewAngle = typeof viewAngleProp === 'number' ? viewAngleProp : viewAngleState;

    const obstacleInFocus = obstacleRefToFocus ? roomData.obstacleAreas?.find(z => z.ref === obstacleRefToFocus) : undefined
    const walkableInFocus = walkableRefToFocus ? roomData.walkableAreas?.find(z => z.ref === walkableRefToFocus) : undefined
    const hotspotInFocus = hotspotIdToFocus ? roomData.hotspots?.find(z => z.id === hotspotIdToFocus) : undefined

    const center = (roomData.frameWidth / 2) + getShift(viewAngle, 1, roomData)
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
            viewAngle={viewAngle}
            showObstacleAreas={showObstacleAreas}
            handleRoomClick={(x, y) => {
                if (onClick) {
                    const point = locateClickInWorld(x, y, viewAngle, roomData)
                    onClick({ x: Math.round(point.x), y: Math.round(point.y) })
                }
            }}
            maxWidth={previewWidth}
            maxHeight={previewHeight}
            forPreview={true}
        >
            {targetPoint && (
                <MarkerShape
                    roomData={roomData}
                    viewAngle={viewAngle}
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
                    viewAngle={viewAngle}
                    roomData={roomData}
                    flash={true}
                />
            )}
        </Room>
        {typeof viewAngleProp === 'undefined' && (
            <ViewAngleSlider viewAngle={viewAngleState} setViewAngle={setViewAngleState} />
        )}
    </Box>
}