import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { MarkerShape } from "@/components/svg/MarkerShape";
import { Room } from "@/components/svg/Room";
import { useGameDesign } from "@/context/game-design-context";
import { ActorData } from "@/definitions";
import { getTargetPoint, getViewAngleCenteredOn, locateClickInWorld, putActorsInDisplayOrder } from "@/lib/roomFunctions";
import { clamp, findById, listIds } from "@/lib/util";
import { Alert, Box, Button, ButtonGroup, Paper, PaperProps, Slider, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ClickPointIcon } from "../material-icons";

interface Props {
    actorData: ActorData;
    reportClick: { (point: { x: number; y: number }, pointRole: PointRole): void };
    pickRoom: { (roomId: string | undefined): void }
}

type PointRole = 'position' | 'walkTo';

const PaperSection = (props: PaperProps) => <Paper component={'section'} {...props}>{props.children}</Paper>

export const PositionPreview = ({ actorData, reportClick, pickRoom }: Props) => {
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

    return (
        <Box component={PaperSection} display={'inline-block'} padding={2} marginBottom={4}>
            <SelectInput
                label="starting room"
                value={roomData?.id ?? ''}
                inputHandler={pickRoom}
                options={listIds(gameDesign.rooms)}
                optional
            />

            {roomData ? (<>

                <ButtonGroup sx={{ paddingBottom: 1 }}>
                    <Button
                        variant={role === 'position' ? 'contained' : 'outlined'}
                        onClick={() => setRole('position')}
                        startIcon={<ClickPointIcon />}
                    >postion</Button>
                    <Button
                        variant={role === 'walkTo' ? 'contained' : 'outlined'}
                        onClick={() => setRole('walkTo')}
                        startIcon={<ClickPointIcon />}
                    >walk to point</Button>
                </ButtonGroup>
                <Box
                    sx={{
                        cursor: 'crosshair',
                        position: 'relative',
                    }}
                >
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
                </Box>

                <Box padding={1}>
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

            </>) : (
                <Stack padding={2} spacing={2}>
                    <Alert severity="info">no initial Room selected</Alert>
                    <Typography>If you want this Actor to have an initial position, select a starting room.</Typography>
                </Stack>
            )}
        </Box >
    )
}