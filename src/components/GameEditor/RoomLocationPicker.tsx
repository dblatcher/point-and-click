import { RoomContentItem } from "@/components/game";
import { MarkerShape } from "@/components/svg/MarkerShape";
import { Room } from "@/components/svg/Room";
import { Point, RoomData } from "@/definitions";
import { locateClickInWorld } from "@/lib/roomFunctions";
import { Box } from "@mui/material";
import { useState } from "react";
import { ViewAngleSlider } from "./RoomEditor/ViewAngleSlider";


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
    flashHotspot?: number
}

export const RoomLocationPicker = ({
    roomData, contents = [], targetPoint,
    viewAngle: viewAngleProp, previewWidth = 600, previewHeight = previewWidth,
    onClick, showObstacleAreas, obstacleRefToFocus, walkableRefToFocus,
    flashHotspot
}: Props) => {

    const [viewAngleState, setViewAngleState] = useState(0)
    const viewAngle = typeof viewAngleProp === 'number' ? viewAngleProp : viewAngleState;

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
            obstacleRefToFocus={obstacleRefToFocus}
            walkableRefToFocus={walkableRefToFocus}
            flashHotspot={flashHotspot}
        >
            {targetPoint && (
                <MarkerShape
                    roomData={roomData}
                    viewAngle={viewAngle}
                    color={'red'}
                    {...targetPoint}
                />
            )}
        </Room>
        {typeof viewAngleProp === 'undefined' && (
            <ViewAngleSlider viewAngle={viewAngleState} setViewAngle={setViewAngleState} />
        )}
    </Box>
}