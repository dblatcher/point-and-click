
import { FieldDef, FieldValue, SchemaForm, getModification } from "@/components/SchemaForm";
import { ActOrder, MoveOrder, stepSchama } from "@/definitions/Order";
import { Box, Typography } from "@mui/material";
import { Component } from "react";
import { ArrayControl } from "../ArrayControl";
import { makeNewStep } from "../defaults";

type OrderWithSteps = MoveOrder | ActOrder

interface Props {
    data: OrderWithSteps;
    animationSuggestions?: string[];
    updateData: { (data: OrderWithSteps): void };
}

export class OrderWithStepsForm extends Component<Props> {
    constructor(props: Props) {
        super(props)
        this.changeStep = this.changeStep.bind(this)
        this.changeValue = this.changeValue.bind(this)
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

    render() {
        const { type, steps, } = this.props.data
        const { animationSuggestions } = this.props
        const { changeStep, changeValue } = this

        return (
            <>
                <Box marginTop={2}>
                    <Typography variant="caption" >Steps</Typography>
                </Box>
                {type === 'act' && (
                    <ArrayControl
                        list={steps}
                        describeItem={(step, index) => (
                            <SchemaForm key={index}
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
                {type === 'move' && (
                    <ArrayControl
                        list={steps}
                        describeItem={(step, index) => (
                            <SchemaForm key={index}
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
                {steps.length === 0 && (
                    <Typography variant="caption">Insert first step:</Typography>
                )}
            </>
        )
    }
}