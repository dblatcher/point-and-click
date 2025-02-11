import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { useGameDesign } from "@/context/game-design-context";
import { Point } from "@/definitions";
import { MoveOrder, MoveStep } from "@/definitions/Order";
import { findById, listIds } from "@/lib/util";
import { Box, Button } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { makeNewStep } from "../defaults";
import { ClickPointActiveIcon, ClickPointIcon } from "../material-icons";
import { RoomLocationPicker } from "../RoomLocationPicker";
import { MoveStepFields } from "./MoveStepFields";


interface Props {
    data: MoveOrder;
    animationSuggestions?: string[];
    updateData: { (data: MoveOrder): void };
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

    const addStep = (point: Point) => modifyOrder({ steps: [...steps, { ...makeNewStep.move(), ...point }] })

    return (
        <Box>
            <SelectInput label="room" optional
                value={data.roomId}
                options={listIds(gameDesign.rooms)}
                inputHandler={(roomId) => modifyOrder({ roomId })} />

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
                    <Button fullWidth startIcon={typeof stepBeingEdited === 'undefined' ? <ClickPointActiveIcon /> : <ClickPointIcon/>}
                        variant={"outlined"}
                        onClick={() => setStepBeingEdited(undefined)}> new step</Button>
                </div>
                {roomData && (
                    <RoomLocationPicker
                        roomData={roomData}
                        previewWidth={400}
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
