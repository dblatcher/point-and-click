/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, Component } from "preact"
import { ActOrder, MoveOrder, orderTypes, stepSchama, TalkOrder } from "../../../definitions/Order";
import { SelectInput } from "../formControls";
import { getDefaultOrder, makeNewStep } from "../defaults";
import { ListEditor } from "../ListEditor";
import { FieldDef, SchemaForm } from "../SchemaForm";

type OrderWithSteps = TalkOrder | MoveOrder | ActOrder
type OrderWithStepsType = 'talk' | 'move' | 'act'

interface Props {
    data: OrderWithSteps;
    animationSuggestions?: string[]
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
            case 'type': {
                if (orderTypes.includes(newValue as OrderWithStepsType)) {
                    updateData(getDefaultOrder(newValue as OrderWithStepsType) as OrderWithSteps)
                }
                break;
            }
            case 'steps': {
                if (data.type === 'talk') {
                    updateData({
                        type: data.type,
                        steps: newValue as (TalkOrder['steps'])
                    })
                }
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

    changeStep(value: string | number | boolean | undefined, field: FieldDef, index: number) {
        const { data } = this.props
        if (!data.steps[index]) {
            return
        }

        const stepCopy: Record<string, unknown> = Object.assign({}, data.steps[index])
        stepCopy[field.key] = value
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

                {type === 'talk' && (
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