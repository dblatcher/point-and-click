import { Box, Paper, PaperProps, Typography, Alert, Stack, ToggleButton, ToggleButtonGroup, Slider } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { Room } from "@/components/svg/Room";
import { MarkerShape } from "@/components/svg/MarkerShape";
import { ActorData, RoomData } from "@/definitions"
import { clamp } from "@/lib/util";
import { getTargetPoint, getViewAngleCenteredOn, locateClickInWorld, putActorsInDisplayOrder } from "@/lib/roomFunctions";

type PointRole = 'position' | 'walkTo';

interface Props {
    actorData: ActorData;
    otherActors: ActorData[];
    roomData?: RoomData;
    reportClick: { (point: { x: number; y: number }, pointRole: PointRole): void };
}

const PaperSection = (props: PaperProps) => <Paper component={'section'} {...props}>{props.children}</Paper>

export const PositionPreview: FunctionComponent<Props> = ({ actorData, roomData, reportClick, otherActors }) => {
    const [role, setRole] = useState<PointRole>('position')
    const [previewWidth, setPreviewWidth] = useState(800)
    const viewAngle = roomData ? clamp(getViewAngleCenteredOn(actorData.x, roomData), 1, -1) : 0

    const handleRole = (
        event: React.MouseEvent<HTMLElement>,
        newRole: string | null,
    ) => {
        if (newRole === 'position' || newRole === 'walkTo') {
            setRole(newRole);
        }
    };

    const contents = [...otherActors, actorData]
        .sort(putActorsInDisplayOrder)
        .map(actor => ({ data: actor }))


    return (
        <>
            <Typography variant="subtitle1">Initial Postion</Typography>
            <Box component={PaperSection} display={'inline-block'} padding={2} marginBottom={4}
                sx={{
                    cursor: 'crosshair',
                    position: 'relative',
                }}>
                {roomData && (<>
                    <Room
                        data={roomData}
                        contents={contents}
                        viewAngle={viewAngle}
                        showObstacleAreas={true}

                        handleRoomClick={(x, y) => {
                            const point = locateClickInWorld(x, y, viewAngle, roomData)
                            reportClick({ x: Math.round(point.x), y: Math.round(point.y) }, role)
                        }}
                        maxWidth={previewWidth}
                        maxHeight={previewWidth}
                        forPreview={true}
                    >
                        <MarkerShape
                            roomData={roomData}
                            viewAngle={viewAngle}
                            color={'red'}
                            {...getTargetPoint(actorData, roomData)}
                        />
                    </Room>

                    <Box component={Paper} sx={{
                        position: 'absolute',
                        display: 'inlineBlock',
                        top: 0,
                        left: 0,
                    }}>
                        <ToggleButtonGroup exclusive value={role} onChange={handleRole}>
                            <ToggleButton value={'position'}>position</ToggleButton>
                            <ToggleButton value={'walkTo'}>walk to point</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box component={Paper} padding={1}
                        sx={{
                            position: 'absolute',
                            display: 'inlineBlock',
                            top: 0,
                            right: 0,
                        }}>
                        <Stack direction={'row'} alignItems={'center'} minWidth={300}>
                            <Typography variant="caption">preview size</Typography>
                            <Slider
                                step={50}
                                marks
                                min={600}
                                max={1200}
                                value={previewWidth}
                                onChange={(e, v) => { setPreviewWidth(v as number) }}
                            />
                            <Typography variant="caption" minWidth={50}>{previewWidth}</Typography>
                        </Stack>
                    </Box>

                </>)}

                {!roomData && (
                    <Stack padding={2} spacing={2}>
                        <Alert severity="info">no initial Room selected</Alert>
                        <Typography>If you want this Actor to have an initial position, go to the Position tab to select the Room this Actor should start the game in.</Typography>
                    </Stack>
                )}
            </Box>
        </>
    )
}