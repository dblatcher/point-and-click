
import { FieldDef, FieldValue, SchemaForm, getModification } from "@/components/SchemaForm";
import { ActOrder, ActStep, MoveOrder, stepSchama } from "@/definitions/Order";
import { Box, Typography } from "@mui/material";
import { Component } from "react";
import { ArrayControl } from "../ArrayControl";
import { makeNewStep } from "../defaults";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { BooleanInput } from "@/components/SchemaForm/BooleanInput";

type OrderWithSteps = MoveOrder | ActOrder

interface Props {
    data: OrderWithSteps;
    animationSuggestions?: string[];
    updateData: { (data: OrderWithSteps): void };
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

export class OrderWithStepsForm extends Component<Props> {
    constructor(props: Props) {
        super(props)
        this.changeStep = this.changeStep.bind(this)
        this.changeValue = this.changeValue.bind(this)
        this.changeActStep = this.changeActStep.bind(this)
    }

    changeValue(propery: keyof OrderWithSteps, newValue: string | undefined | OrderWithSteps['steps']) {
        const { data, updateData } = this.props
        switch (propery) {
            case 'steps': {
                if (data.type === 'act') {
                    updateData({
                        type: data.type,
                        steps: newValue as (ActOrder['steps'])
                    })
                }
                if (data.type === 'move') {
                    updateData({
                        type: data.type,
                        steps: newValue as (MoveOrder['steps'])
                    })
                }
                break;
            }
        }
    }

    changeStep(value: FieldValue, field: FieldDef, index: number) {
        const { data } = this.props
        if (!data.steps[index]) {
            return
        }

        const stepCopy = Object.assign({}, data.steps[index], getModification(value, field))
        const result = stepSchama[data.type].safeParse(stepCopy)
        if (!result.success) { return }
        const stepListCopy = [...data.steps]
        stepListCopy.splice(index, 1, result.data)
        this.changeValue('steps', stepListCopy as OrderWithSteps['steps'])
    }

    changeActStep(mod: Partial<ActStep>, index: number) {
        const { data } = this.props
        if (data.type !== 'act') {
            return
        }
        const stepToUpdate = data.steps[index]
        if (!stepToUpdate) {
            return
        }
        const updatedStep = {
            ...stepToUpdate,
            ...mod,
        }
        const stepListCopy = [...data.steps]
        stepListCopy.splice(index, 1, updatedStep)
        this.changeValue('steps', stepListCopy)
    }

    render() {
        const { type, steps, } = this.props.data
        const { animationSuggestions } = this.props
        const { changeStep, changeValue } = this

        return (
            <>
                <Box marginTop={2}>
                    {steps.length === 0 ? (
                        <Typography variant="caption">Insert first step:</Typography>
                    ) : <Typography variant="caption">Steps x{steps.length}</Typography>
                    }
                </Box>
                {type === 'act' && (
                    <ArrayControl
                        deleteIcon="clear"
                        list={steps}
                        describeItem={(step, index) => (
                            <ActStepFields index={index}
                                changeStep={this.changeActStep}
                                step={step}
                                animationSuggestions={animationSuggestions}
                            />
                        )}
                        mutateList={(newList) => changeValue('steps', newList)}
                        createItem={makeNewStep[type]}
                        buttonSize="small"
                        frame="NONE"
                    />
                )}
                {type === 'move' && (
                    <ArrayControl
                        list={steps}
                        deleteIcon="clear"
                        describeItem={(step, index) => (
                            <SchemaForm key={index}
                                textInputDelay={1000}
                                changeValue={(value, field) => { changeStep(value, field, index) }}
                                data={step}
                                suggestions={{ animation: animationSuggestions }}
                                schema={stepSchama[type]} />
                        )}
                        mutateList={(newList) => changeValue('steps', newList)}
                        createItem={makeNewStep[type]}
                        frame="PLAIN"
                    />
                )}
            </>
        )
    }
}