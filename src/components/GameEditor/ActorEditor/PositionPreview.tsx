import { MarkerShape } from "@/components/svg/MarkerShape";
import { Room } from "@/components/svg/Room";
import { useGameDesign } from "@/context/game-design-context";
import { ActorData } from "@/definitions";
import { getTargetPoint, getViewAngleCenteredOn, locateClickInWorld, putActorsInDisplayOrder } from "@/lib/roomFunctions";
import { clamp, findById } from "@/lib/util";
import { Alert, Box, Paper, PaperProps, Slider, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useState } from "react";

interface Props {
    actorData: ActorData;
    reportClick: { (point: { x: number; y: number }, pointRole: PointRole): void };
}

type PointRole = 'position' | 'walkTo';

const PaperSection = (props: PaperProps) => <Paper component={'section'} {...props}>{props.children}</Paper>

export const PositionPreview = ({ actorData, reportClick }: Props) => {
    const [role, setRole] = useState<PointRole>('position')
    const [previewWidth, setPreviewWidth] = useState(600)
    const { gameDesign } = useGameDesign();

    const roomData = findById(actorData.room, gameDesign.rooms)

    const otherActors = (gameDesign.actors && roomData)
        ? gameDesign.actors.filter(actor => actor.room === roomData.id && actor.id !== actorData.id)
        : []

    const viewAngle = roomData ? clamp(getViewAngleCenteredOn(actorData.x, roomData), 1, -1) : 0

    const contents = [...otherActors, actorData]
        .sort(putActorsInDisplayOrder)
        .map(actor => ({ data: actor }))

    const handleRole = (
        event: React.MouseEvent<HTMLElement>,
        newRole: string | null,
    ) => {
        if (newRole === 'position' || newRole === 'walkTo') {
            setRole(newRole);
        }
    };

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
                                min={400}
                                max={800}
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