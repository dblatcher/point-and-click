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
    onClick?: { (point: { x: number; y: number }): void };
}

export const RoomLocationPicker = ({
    roomData, contents = [], targetPoint,
    viewAngle: viewAngleProp, previewWidth = 600,
    onClick
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
            showObstacleAreas={true}
            handleRoomClick={(x, y) => {
                if (onClick) {
                    const point = locateClickInWorld(x, y, viewAngle, roomData)
                    onClick({ x: Math.round(point.x), y: Math.round(point.y) })
                }
            }}
            maxWidth={previewWidth}
            maxHeight={previewWidth}
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
        </Room>
        {typeof viewAngleProp === 'undefined' && (
            <ViewAngleSlider viewAngle={viewAngleState} setViewAngle={setViewAngleState} />
        )}
    </Box>
}