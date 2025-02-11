import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { useGameDesign } from "@/context/game-design-context";
import { MoveOrder, MoveStep } from "@/definitions/Order";
import { findById, listIds } from "@/lib/util";
import { Box, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { ArrayControl } from "../ArrayControl";
import { makeNewStep } from "../defaults";
import { MoveStepFields } from "./MoveStepFields";
import { RoomLocationPicker } from "../RoomLocationPicker";


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

    return (
        <Box>
            <SelectInput label="room" optional
                value={data.roomId}
                options={listIds(gameDesign.rooms)}
                inputHandler={(roomId) => modifyOrder({ roomId })} />

            <Box marginTop={2}>
                {steps.length === 0 ? (
                    <Typography variant="caption">Insert first step:</Typography>
                ) : <Typography variant="caption">Steps x{steps.length}</Typography>
                }
            </Box>

            <Box display={'flex'} gap={2}>
                <ArrayControl
                    list={steps}
                    deleteIcon="clear"
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
                    createItem={makeNewStep.move}
                    frame="PLAIN"
                />
                {roomData && (
                    <RoomLocationPicker
                        roomData={roomData}
                        previewWidth={300}
                        renderAllZones
                        subPoints={data.steps}
                        onClick={(point) => typeof stepBeingEdited === 'number'
                            ? changeMoveStep(point, stepBeingEdited)
                            : modifyOrder({ steps: [...steps, {...makeNewStep.move(), ...point}] })
                        }
                    />
                )}
            </Box>
        </Box>
    )
}
