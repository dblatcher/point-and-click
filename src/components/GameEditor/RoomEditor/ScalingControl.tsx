
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import HorizontalLine from "@/components/svg/HorizontalLine";
import { Room } from "@/components/svg/Room";
import { useGameDesign } from "@/context/game-design-context";
import { ActorData, RoomData, ScaleLevel } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { locateClickInWorld } from "@/lib/roomFunctions";
import { clamp, findById } from "@/lib/util";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { EditorBox } from "../EditorBox";
import { PickActorDialog } from "../PickActorDialog";
import { XYControl } from "../XYControl";
import { ViewAngleSlider } from "./ViewAngleSlider";

interface Props {
    room: RoomData;
}


export const ScalingControl = ({ room }: Props) => {
    const [scale, setScale] = useState(1.5)
    const [viewAngleX, setViewAngleX] = useState(0)
    const [viewAngleY, setViewAngleY] = useState(0)
    const [testSpriteX, setTestSpriteX] = useState(100)
    const [testSpriteY, setTestSpriteY] = useState(100)
    const [testActor, setTestActor] = useState<ActorData | undefined>(undefined)
    const [actorDialogOpen, setActorDialogOpen] = useState<boolean>(false)
    const { scaling = [], height } = room
    const { gameDesign, modifyRoom } = useGameDesign()

    const change = (scaling: ScaleLevel) => {
        modifyRoom(`change scaling, room ${room.id}`, room.id, { scaling })
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
        const { x, y } = locateClickInWorld(clickX, clickY, viewAngleX, viewAngleY, room)
        setTestSpriteX(x)
        setTestSpriteY(y)
        if (testActor) {
            const newActor = { ...testActor, x, y }
            setTestActor(newActor)
        }
    }

    return <>
        <Grid container flexWrap={'nowrap'} spacing={2}>
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
                    createButtonPlacement="END"
                />

                <EditorBox title={`Test Sprite: ${testActor?.id ?? '[none]'}`}>
                    <XYControl point={{ x: testSpriteX, y: testSpriteY }} changePosition={(_, mod) => {
                        if (typeof mod.x === 'number') {
                            setTestSpriteX(mod.x)
                            if (testActor) {
                                setTestActor({ ...testActor, x: mod.x })
                            }
                        }
                        if (typeof mod.y === 'number') {
                            setTestSpriteY(mod.y)
                            if (testActor) {
                                setTestActor({ ...testActor, y: mod.y })
                            }
                        }

                    }} />
                    <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Button variant="contained" color="secondary"
                            onClick={() => { setActorDialogOpen(true) }}
                        >Pick Actor for test sprite</Button>
                        {!!testActor && (
                            <Typography>click room to move sprite</Typography>
                        )}
                    </Box>
                </EditorBox>
            </Grid>
            <Grid item flex={1}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
                    <NumberInput label="preview scale" value={scale} notFullWidth
                        inputHandler={setScale} max={2} min={.5} step={.05} />
                </Box>
                <Box style={{ position: 'relative', display: 'inline-block', cursor: !!testActor ? 'crosshair' : undefined }} component={'section'}>
                    <Room data={room} noSound noMargin
                        viewAngleX={viewAngleX}
                        viewAngleY={viewAngleY}
                        handleRoomClick={handleClick}
                        maxHeight={(room.frameHeight || room.height) * scale}
                        maxWidth={room.frameWidth * scale}
                        orderedActors={testActor ? [{ data: testActor }] : []}
                        surfaceContent={
                            scaling.map((yAndScale, index) => (
                                <HorizontalLine key={index}
                                    y={yAndScale[0]}
                                    text={`scale: ${yAndScale[1]}`}
                                />
                            ))
                        }
                    />
                    <Box position={'absolute'} left={0} top={10}>
                        <ViewAngleSlider viewAngle={viewAngleY} setViewAngle={setViewAngleY} forY trackLength={((room.frameHeight || room.height) * scale) - 50} />
                    </Box>
                    <Box position={'absolute'} right={10} bottom={0}>
                        <ViewAngleSlider viewAngle={viewAngleX} setViewAngle={setViewAngleX} trackLength={(room.frameWidth * scale) - 50} />
                    </Box>
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