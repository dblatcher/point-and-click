import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { useGameDesign } from "@/context/game-design-context";
import { ActorData, Point } from "@/definitions";
import { Direction, directions } from "@/definitions/BaseTypes";
import { getTargetPoint, getViewAngleXCenteredOn, getViewAngleYCenteredOn, putActorsInDisplayOrder } from "@/lib/roomFunctions";
import { findById, listIds } from "@/lib/util";
import { Alert, Box, Slider, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { WalkToControl, XYControl } from "../XYControl";
import { RoomLocationPicker } from "../RoomLocationPicker";

interface Props {
    actorData: ActorData;
    updateFromPartial: { (mod: Partial<ActorData>): void }
    defaultPreviewWidth?: number
}

type PointRole = 'position' | 'walkTo';


export const PositionPreview = ({ actorData, updateFromPartial, defaultPreviewWidth = 400 }: Props) => {
    const [role, setRole] = useState<PointRole>('position')
    const [previewWidth, setPreviewWidth] = useState(defaultPreviewWidth)
    const [lockAngle, setLockAngle] = useState(true)
    const { gameDesign } = useGameDesign();

    useEffect(() => {
        setPreviewWidth(defaultPreviewWidth)
    }, [actorData.room, defaultPreviewWidth, setPreviewWidth])

    const roomData = findById(actorData.room, gameDesign.rooms)

    const otherActors = (gameDesign.actors && roomData)
        ? gameDesign.actors.filter(actor => actor.room === roomData.id && actor.id !== actorData.id)
        : []

    const viewAngleX = (lockAngle && roomData) ? getViewAngleXCenteredOn(actorData.x, roomData) : undefined
    const viewAngleY = (lockAngle && roomData) ? getViewAngleYCenteredOn(actorData.y, roomData) : undefined

    const contents = [...otherActors, actorData]
        .sort(putActorsInDisplayOrder)
        .map(actor => ({ data: actor }))


    const handlePreviewClick = (point: Point, pointRole: 'position' | 'walkTo') => {
        switch (pointRole) {
            case 'position':
                return updateFromPartial(point)
            case 'walkTo': {
                const { x, y } = actorData;
                const walkToX = point.x - x
                const walkToY = point.y - y
                return updateFromPartial({ walkToX, walkToY })
            }
        }
    }

    return (
        <Box display={'flex'} marginTop={2} gap={4}>
            <Box flexBasis={250} flexShrink={0} component={'section'}>
                <SelectInput label="Starting room"
                    options={listIds(gameDesign.rooms)}
                    value={actorData.room || ''}
                    optional={true}
                    inputHandler={room => updateFromPartial({ room })} />

                <XYControl
                    point={actorData}
                    changePosition={(index, mod) => updateFromPartial(mod)}
                    handlePositionSelectButton={() => setRole('position')}
                    positionSelectIsActive={role === 'position'}
                />
                <WalkToControl
                    point={actorData}
                    changePosition={(index, mod) => updateFromPartial(mod)}
                    handlePositionSelectButton={() => setRole('walkTo')}
                    positionSelectIsActive={role === 'walkTo'}
                />

                <SelectInput label="direction"
                    value={actorData.direction || 'left'}
                    options={directions}
                    inputHandler={(direction) => updateFromPartial({ direction: (direction ?? 'left') as Direction })} />
            </Box>

            <Box flex={1} component={'section'} alignItems={'center'} padding={0} marginBottom={4}>
                {roomData ? (<>
                    <Box padding={1} maxWidth={'sm'}>
                        <Box display={'inline-flex'} alignItems={'center'}>
                            <Typography variant="caption">preview size</Typography>
                            <Slider sx={{ width: 150 }}
                                step={25}
                                marks
                                min={200}
                                max={600}
                                value={previewWidth}
                                onChange={(e, v) => { setPreviewWidth(v as number) }}
                            />
                            <Typography variant="caption" minWidth={50}>{previewWidth}</Typography>
                        </Box>
                        <Box display={'inline-flex'} alignItems={'center'}>
                            <Typography>center on {actorData.id}</Typography>
                            <BooleanInput value={lockAngle} inputHandler={setLockAngle} />
                        </Box>
                        <RoomLocationPicker
                            roomData={roomData}
                            targetPoint={getTargetPoint(actorData, roomData)}
                            contents={contents}
                            viewAngleX={viewAngleX}
                            viewAngleY={viewAngleY}
                            previewWidth={previewWidth}
                            onClick={(point) => {
                                handlePreviewClick(point, role)
                            }}
                        />
                    </Box>

                </>) : (
                    <Stack padding={2} spacing={2}>
                        <Alert severity="info">no initial Room selected</Alert>
                        <Typography>If you want this Actor to have an initial position, select a starting room.</Typography>
                    </Stack>
                )}
            </Box >
        </Box>
    )
}