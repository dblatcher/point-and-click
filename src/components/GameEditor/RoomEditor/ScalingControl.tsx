
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { ActorData, RoomData, ScaleLevel } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { clamp, eventToNumber, findById } from "@/lib/util";
import { Alert, Box, Button, Grid, Stack, Typography } from "@mui/material";
import { ArrayControl } from "../ArrayControl";
import { useGameDesign } from "@/context/game-design-context";
import { useState } from "react";
import { Room } from "@/components/svg/Room";
import HorizontalLine from "@/components/svg/HorizontalLine";
import { RangeInput } from "../RangeInput";
import { locateClickInWorld } from "@/lib/roomFunctions";
import { ViewAngleSlider } from "./ViewAngleSlider";
import { EditorBox } from "../EditorBox";
import { PickActorDialog } from "../PickActorDialog";

interface Props {
    room: RoomData;
}


export const ScalingControl = ({ room }: Props) => {
    const [scale, setScale] = useState(1.5)
    const [viewAngle, setViewAngle] = useState(0)
    const [hue, setHue] = useState(0)
    const [testSpriteX, setTestSpriteX] = useState(100)
    const [testSpriteY, setTestSpriteY] = useState(100)
    const [testActor, setTestActor] = useState<ActorData | undefined>(undefined)
    const [actorDialogOpen, setActorDialogOpen] = useState<boolean>(false)
    const { scaling = [], height } = room
    const { performUpdate, gameDesign } = useGameDesign()

    const change = (scaling: ScaleLevel) => {
        performUpdate('rooms', { ...room, scaling })
    }

    const handleAdjustment = (
        index: number, value: number, property: 'scale' | 'y'
    ) => {
        const newScaling = cloneData(scaling)
        const propertyIndex = property === 'scale' ? 1 : 0;
        newScaling[index][propertyIndex] = value
        change(newScaling)
    }

    const addNew = (): [number, number] => {
        const last = scaling[scaling.length - 1]
        return last ? [last[0] + 15, clamp(last[1] - .1, height)] : [0, 1]
    }

    const handleClick = (clickX: number, clickY: number) => {
        const { x, y } = locateClickInWorld(clickX, clickY, viewAngle, room)
        setTestSpriteX(x)
        setTestSpriteY(y)
        if (testActor) {
            const newActor = { ...testActor, x, y }
            setTestActor(newActor)
        }
    }


    return <>
        <Grid container flexWrap={'nowrap'} spacing={1}>
            <Grid item xs={4}>
                <Typography>Scale lines</Typography>
                <ArrayControl
                    stackProps={{
                        marginBottom: 4
                    }}
                    list={scaling}
                    buttonSize='medium'
                    describeItem={(level, index) => {
                        const [y, scale] = level
                        return (
                            <Stack key={index} direction={'row'} spacing={1}>
                                <Box>
                                    <NumberInput label="Y" value={y}
                                        inputHandler={(value) => handleAdjustment(index, value, 'y')}
                                        max={height} min={0} step={5} />
                                </Box>

                                <Box>
                                    <NumberInput label="scale" value={scale}
                                        inputHandler={(value) => handleAdjustment(index, value, 'scale')}
                                        max={5} min={0} step={.1} />
                                </Box>
                            </Stack>
                        )
                    }}
                    mutateList={change}
                    createItem={addNew}
                    createButton="END"
                />

                <EditorBox title={`Test Sprite: ${testActor?.id ?? '[none]'}`}>
                    <RangeInput stackProps={{ justifyContent: 'center' }}
                        label="x"
                        value={testSpriteX}
                        max={room.width} min={0}
                        onChange={event => {
                            const x = eventToNumber(event.nativeEvent)
                            setTestSpriteX(x)
                            if (testActor) {
                                setTestActor({ ...testActor, x })
                            }
                        }}
                    />
                    <RangeInput stackProps={{ justifyContent: 'center' }}
                        label="y"
                        value={testSpriteY}
                        max={room.height} min={0}
                        onChange={event => {
                            const y = eventToNumber(event.nativeEvent)
                            setTestSpriteY(y)
                            if (testActor) {
                                setTestActor({ ...testActor, y })
                            }
                        }}
                    />
                    <Alert>click room to position test sprite</Alert>
                    <Button variant="contained" color="secondary"
                        onClick={() => { setActorDialogOpen(true) }}
                    >Pick Actor for test sprite</Button>
                </EditorBox>
            </Grid>
            <Grid item flex={1}>
                <div style={{ cursor: 'crosshair' }}>
                    <Room data={room} forPreview
                        viewAngle={viewAngle}
                        handleRoomClick={handleClick}
                        maxHeight={room.height * scale}
                        maxWidth={room.frameWidth * scale}
                        contents={testActor ? [{ data: testActor }] : []}
                    >
                        {scaling.map((yAndScale, index) => (
                            <HorizontalLine key={index}
                                y={yAndScale[0]}
                                text={`scale: ${yAndScale[1]}`}
                                roomData={room} />
                        ))}
                    </Room>
                </div>
                <Box>
                    <ViewAngleSlider viewAngle={viewAngle} setViewAngle={setViewAngle} />
                    <NumberInput label="preview scale" value={scale}
                        inputHandler={setScale} max={2} min={.5} step={.05} />
                </Box>
            </Grid>
        </Grid>

        <PickActorDialog
            isOpen={actorDialogOpen}
            close={() => { setActorDialogOpen(false) }}
            onSelect={(actorId) => {
                const actor = findById(actorId, gameDesign.actors)
                if (actor) {
                    setTestActor({ ...cloneData(actor), x: testSpriteX, y: testSpriteY })
                }
            }} />
    </>
}