/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, Component } from "preact"
import { ActOrder, MoveOrder, orderTypes, stepSchama } from "../../../definitions/Order";
import { SelectInput } from "../formControls";
import { makeNewStep } from "../defaults";
import { ListEditor } from "../ListEditor";
import { FieldDef, FieldValue, getModification, SchemaForm } from "../SchemaForm";

type OrderWithSteps =  MoveOrder | ActOrder

interface Props {
    data: OrderWithSteps;
    animationSuggestions?: string[];
    updateData: { (data: OrderWithSteps): void };
    changeType: { (type: string): void };
}

export class OrderWithStepsForm extends Component<Props> {
    constructor(props: Props) {
        super(props)
        this.changeStep = this.changeStep.bind(this)
        this.changeValue = this.changeValue.bind(this)
    }

    changeValue(propery: keyof OrderWithSteps, newValue: string | undefined | OrderWithSteps['steps']) {
        const { data, updateData,changeType } = this.props
        switch (propery) {
            case 'type': {
                changeType(newValue as string )
                break;
            }
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

        const stepCopy = Object.assign({}, data.steps[index] , getModification(value,field))
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
            <article style={{ flex: 1 }}>

                <div style={{ borderBottom: '3px double black' }}>
                    <SelectInput label="order type"
                        value={type}
                        items={orderTypes}
                        onSelect={newValue => changeValue('type', newValue)}
                    />
                </div>

                {type === 'act' && (
                    <ListEditor
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
                    />
                )}
                {type === 'move' && (
                    <ListEditor
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
                    />
                )}
            </article>
        )
    }
}