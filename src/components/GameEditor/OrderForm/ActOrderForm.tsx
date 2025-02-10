
import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { ActOrder, ActStep } from "@/definitions/Order";
import { Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { ArrayControl } from "../ArrayControl";
import { makeNewStep } from "../defaults";


interface Props {
    data: ActOrder;
    animationSuggestions?: string[];
    updateData: { (data: ActOrder): void };
}

const ActStepFields = (props: {
    index: number,
    animationSuggestions?: string[],
    changeStep: { (mod: Partial<ActStep>, index: number): void },
    step: ActStep
}) => {
    const { step, index, animationSuggestions, changeStep } = props

    return <>
        <Box display={'flex'} gap={1}>
            <StringInput label="animation"
                value={step.animation ?? ''}
                suggestions={animationSuggestions}
                inputHandler={(animation) => changeStep({ animation }, index)}
            />
            <NumberInput label="duration"
                value={step.duration}
                inputHandler={(duration) => changeStep({ duration }, index)}
            />
            <BooleanInput label="reverse"
                value={step.reverse ?? false}
                inputHandler={(reverse) => changeStep({ reverse }, index)}
            />
        </Box>
    </>
}

export const ActOrderForm: FunctionComponent<Props> = ({
    data,
    animationSuggestions,
    updateData,
}: Props) => {

    const modifyOrder = (mod: Partial<ActOrder>) => {
        updateData({
            ...data,
            ...mod
        })
    }

    const changeActStep = (mod: Partial<ActStep>, index: number) => {
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


    const { steps } = data

    return (
        <>
            <Box marginTop={2}>
                {steps.length === 0 ? (
                    <Typography variant="caption">Insert first step:</Typography>
                ) : <Typography variant="caption">Steps x{steps.length}</Typography>
                }
            </Box>
            <ArrayControl
                deleteIcon="clear"
                list={steps}
                describeItem={(step, index) => (
                    <ActStepFields index={index}
                        changeStep={changeActStep}
                        step={step}
                        animationSuggestions={animationSuggestions}
                    />
                )}
                mutateList={(steps) => modifyOrder({ steps })}
                createItem={makeNewStep.act}
                buttonSize="small"
                frame="NONE"
            />
        </>
    )
}
