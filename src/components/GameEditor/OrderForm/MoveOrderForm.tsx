import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { useGameDesign } from "@/context/game-design-context";
import { Point } from "@/lib/pathfinding/geometry";
import { MoveOrder, MoveStep } from "point-click-lib";
import { findById, listIds } from "@/lib/util";
import { Box, Button, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { makeNewStep } from "../defaults";
import { ClickPointActiveIcon, ClickPointIcon } from "../material-icons";
import { RoomLocationPicker } from "../RoomLocationPicker";
import { MoveStepFields } from "./MoveStepFields";
import { OptionalNumberInput } from "@/components/SchemaForm/OptionalNumberInput";
import { buildContentForRoomInDesign } from "@/components/game/put-contents-in-order";


interface Props {
    data: MoveOrder;
    animationSuggestions?: string[];
    updateData: { (data: MoveOrder): void };
}

const getAnimationForEveryStep = (steps: MoveStep[]) => {
    const set = new Set(steps.map(step => step.animation))
    return set.size === 1 ? Array.from(set)[0] : undefined
}

const getSpeedForEveryStep = (steps: MoveStep[]) => {
    const set = new Set(steps.map(step => step.speed))
    return set.size === 1 ? Array.from(set)[0] : undefined
}

export const MoveOrderForm: FunctionComponent<Props> = ({ data, animationSuggestions, updateData }) => {
    const { gameDesign } = useGameDesign()
    const { steps } = data
    const [stepBeingEdited, setStepBeingEdited] = useState<number | undefined>(undefined)
    const roomData = findById(data.roomId, gameDesign.rooms)

    const modifyOrder = (mod: Partial<MoveOrder>) => {
        updateData({
            ...data,
            ...mod
        })
    }

    const changeMoveStep = (mod: Partial<MoveStep>, index: number) => {
        const stepToUpdate = data.steps[index]
        if (!stepToUpdate) {
            return
        }
        const updatedStep = {
            ...stepToUpdate,
            ...mod,
        }
        const steps = [...data.steps]
        steps.splice(index, 1, updatedStep)
        modifyOrder({ steps })
    }

    const sharedAnimation = getAnimationForEveryStep(steps)
    const sharedSpeed = getSpeedForEveryStep(steps)

    const addStep = (point: Point) => modifyOrder({
        steps: [...steps, {
            ...makeNewStep.move(),
            animation: sharedAnimation,
            speed: sharedSpeed,
            ...point
        }]
    })

    const changeAnimationOnEveryStep = (animation: string | undefined) => {
        modifyOrder({
            steps: steps.map(step => ({ ...step, animation }))
        })
    }

    const changeSpeedOnEveryStep = (speed: number | undefined) => {
        modifyOrder({
            steps: steps.map(step => ({ ...step, speed }))
        })
    }
    return (
        <Box>
            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Box display={'flex'} gap={2} alignItems={'center'}>
                    <Typography>For every step:</Typography>
                    <SelectInput label="animation" optional notFullWidth
                        minWidth={120}
                        value={sharedAnimation}
                        options={animationSuggestions ?? []}
                        inputHandler={changeAnimationOnEveryStep} />
                    <OptionalNumberInput label="speed" optional notFullWidth
                        minWidth={120}
                        value={sharedSpeed}
                        min={.1} max={10} step={.2}
                        inputHandler={changeSpeedOnEveryStep} />
                </Box>
                <SelectInput label="room" optional notFullWidth
                    minWidth={80}
                    value={data.roomId}
                    options={listIds(gameDesign.rooms)}
                    inputHandler={(roomId) => modifyOrder({ roomId })} />
            </Box>
            <Box display={'flex'} gap={2} justifyContent={'space-between'}>
                <div>
                    <ArrayControl
                        list={steps}
                        deleteIcon="clear"
                        noMoveButtons
                        describeItem={(step, index) => (
                            <MoveStepFields key={index}
                                step={step}
                                animationSuggestions={animationSuggestions}
                                index={index}
                                changeStep={changeMoveStep}
                                positionSelectIsActive={stepBeingEdited === index}
                                setStepBeingEdited={setStepBeingEdited}
                            />
                        )}
                        mutateList={(steps) => modifyOrder({ steps })}
                        frame="PLAIN"
                    />
                    <Button fullWidth startIcon={typeof stepBeingEdited === 'undefined' ? <ClickPointActiveIcon /> : <ClickPointIcon />}
                        variant={"outlined"}
                        onClick={() => setStepBeingEdited(undefined)}> new step</Button>
                </div>
                {roomData && (
                    <RoomLocationPicker
                        roomData={roomData}
                        contents={buildContentForRoomInDesign(roomData.id, gameDesign)}
                        previewWidth={400}
                        previewHeight={300}
                        renderAllZones
                        subPoints={data.steps}
                        onClick={(point) => typeof stepBeingEdited === 'number'
                            ? changeMoveStep(point, stepBeingEdited)
                            : addStep(point)
                        }
                    />
                )}
            </Box>
        </Box>
    )
}
