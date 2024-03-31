
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { ActorData, RoomData, ScaleLevel } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { clamp, eventToNumber } from "@/lib/util";
import { Alert, Box, Grid, Stack, Typography } from "@mui/material";
import { ArrayControl } from "../ArrayControl";
import { useGameDesign } from "@/context/game-design-context";
import { useState } from "react";
import { Room } from "@/components/svg/Room";
import HorizontalLine from "@/components/svg/HorizontalLine";
import { makeTestActor } from "./testSprite";
import { RangeInput } from "./RangeInput";
import { locateClickInWorld } from "@/lib/roomFunctions";
import { ViewAngleSlider } from "./ViewAngleSlider";
import { EditorBox } from "../EditorBox";

interface Props {
    room: RoomData;
}

const initialTestActor = makeTestActor({ x: 100, y: 100 });

export const ScalingControl = ({ room }: Props) => {
    const [scale, setScale] = useState(.75)
    const [viewAngle, setViewAngle] = useState(0)
    const [testActor, setTestActor] = useState<ActorData>(initialTestActor)
    const { scaling = [], height } = room
    const { performUpdate } = useGameDesign()

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
        const newActor = { ...testActor, x, y }
        setTestActor(newActor)
    }

    return (<Box>
        <Grid container>
            <Grid item xs={2}>
                <Typography>Scale lines</Typography>
                <ArrayControl
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
            </Grid>
            <Grid item xs={10}>
                <div style={{ cursor: 'crosshair' }}>
                    <Room data={room} forPreview
                        viewAngle={viewAngle}
                        handleRoomClick={handleClick}
                        maxHeight={room.height * scale}
                        maxWidth={room.frameWidth * scale}
                        contents={[{ data: testActor }]}
                    >
                        {scaling.map((yAndScale, index) => (
                            <HorizontalLine key={index}
                                y={yAndScale[0]}
                                text={`scale: ${yAndScale[1]}`}
                                roomData={room} />
                        ))}
                    </Room>
                </div>
                <Box maxWidth={room.frameWidth * scale}>
                    <ViewAngleSlider viewAngle={viewAngle} setViewAngle={setViewAngle} />
                    <NumberInput label="preview scale" value={scale}
                        inputHandler={setScale} max={2} min={.5} step={.05} />
                </Box>
            </Grid>
        </Grid>

        <EditorBox boxProps={{ maxWidth: 200 }} title="Test Sprite">
            <RangeInput
                label="base height"
                value={testActor.height}
                max={200} min={10}
                onChange={event => {
                    setTestActor({ ...testActor, height: eventToNumber(event.nativeEvent) })
                }}
            />
            <RangeInput
                label="base width"
                value={testActor.width}
                max={200} min={10}
                onChange={event => {
                    setTestActor({ ...testActor, width: eventToNumber(event.nativeEvent) })
                }}
            />
            <Alert>click room to position test sprite</Alert>
        </EditorBox>
    </Box >)
}