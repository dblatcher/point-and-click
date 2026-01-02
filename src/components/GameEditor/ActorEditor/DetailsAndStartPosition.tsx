import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { OptionalNumberInput } from "@/components/SchemaForm/OptionalNumberInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { useGameDesign } from "@/context/game-design-context";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { getTargetPoint, getViewAngleXCenteredOn, getViewAngleYCenteredOn, putActorsInDisplayOrder } from "@/lib/roomFunctions";
import { XY } from "@/lib/types-and-constants";
import { findById, listIds } from "@/lib/util";
import { Alert, Box, Slider, Stack, Typography } from "@mui/material";
import { ActorData, Direction, directions } from "point-click-lib";
import { useEffect, useState } from "react";
import { ColorInput } from "../ColorInput";
import { DelayedStringInput } from "../DelayedStringInput";
import { InteractionsDialogsButton } from "../InteractionsDialogsButton";
import { RoomLocationPicker } from "../RoomLocationPicker";
import { WalkToControl, XYControl } from "../XYControl";
import { EditorBox } from "../layout/EditorBox";
import { LayoutControls, LayoutHolder, LayoutPreview } from "../layout/SplitLayout";

interface Props {
    actorData: ActorData;
    updateFromPartial: { (mod: Partial<ActorData>): void }
    defaultPreviewWidth?: number
}

type PointRole = 'position' | 'walkTo';


export const DetailsAndStartPosition = ({ actorData, updateFromPartial, defaultPreviewWidth = 400 }: Props) => {
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

    const fixedView = lockAngle && roomData ? {
        x: getViewAngleXCenteredOn(actorData.x, roomData),
        y: getViewAngleYCenteredOn(actorData.y, roomData)
    } : undefined;

    const contents = [...otherActors, actorData]
        .sort(putActorsInDisplayOrder)
        .map(actor => ({ data: actor }))


    const handlePreviewClick = (point: XY, pointRole: 'position' | 'walkTo') => {
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

    const spriteData = gameDesign.sprites.find(sprite => sprite.id === actorData.sprite)
    const statusSuggestions = getStatusSuggestions(actorData.id, {
        sprites: spriteData ? [spriteData] : [],
        actors: [actorData]
    })

    return (
        <LayoutHolder>
            <LayoutControls>
                <EditorBox title="Details">
                    <DelayedStringInput label="name" value={actorData.name ?? ''} optional inputHandler={name => updateFromPartial({ name: name.length ? name : undefined })} />
                    <DelayedStringInput label="initial status" optional
                        suggestions={statusSuggestions}
                        value={actorData.status ?? ''}
                        inputHandler={status => updateFromPartial({ status })} />
                    <OptionalNumberInput label="movement speed"
                        value={actorData.speed}
                        inputHandler={speed => updateFromPartial({ speed })}
                    />
                    <Stack alignItems={'flex-start'}>
                        <BooleanInput label="Is player Actor"
                            value={actorData.isPlayer}
                            inputHandler={isPlayer => updateFromPartial({ isPlayer })} />
                        <BooleanInput label="Cannot interact with"
                            value={actorData.noInteraction}
                            inputHandler={noInteraction => updateFromPartial({ noInteraction })} />
                    </Stack>
                    <Box display={'flex'} justifyContent={'space-between'}>
                        <ColorInput
                            label="speech"
                            value={actorData.dialogueColor || ''}
                            setValue={dialogueColor => {
                                updateFromPartial({ dialogueColor })
                            }} />
                        <InteractionsDialogsButton
                            disabled={actorData.noInteraction || actorData.isPlayer}
                            criteria={(interaction) => interaction.targetId === actorData.id}
                            newPartial={{ targetId: actorData.id }}
                        />
                    </Box>
                </EditorBox>
                <EditorBox title="Start Position">
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
                </EditorBox>
            </LayoutControls>

            <LayoutPreview>
                {roomData ? (<>
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
                        fixedView={fixedView}
                        previewWidth={previewWidth}
                        onClick={(point) => {
                            handlePreviewClick(point, role)
                        }}
                    />

                </>) : (
                    <Stack padding={2} spacing={2}>
                        <Alert severity="info">no initial Room selected</Alert>
                        <Typography>If you want this Actor to have an initial position, select a starting room.</Typography>
                    </Stack>
                )}
            </LayoutPreview>
        </LayoutHolder>
    )
}