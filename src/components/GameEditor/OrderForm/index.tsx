/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, Component, Fragment } from "preact"
import styles from "../editorStyles.module.css"
import { ActOrder, ActOrderSchema, MoveOrder, MoveOrderSchema, Order, OrderType, orderTypes, TalkOrder, TalkOrderSchema } from "../../../definitions/Order";
import { SelectInput } from "../formControls";
import { getDefaultOrder } from "../defaults";
import { ListEditor } from "../ListEditor";
import { FieldDef, SchemaForm } from "../SchemaForm";
import { z } from "zod";

interface Props {
    data: Order;
    updateData: { (data: Order): void };
}

const stepSchama = {
    talk: TalkOrderSchema.shape.steps.element,
    act: ActOrderSchema.shape.steps.element,
    move: MoveOrderSchema.shape.steps.element,
}

type TalkStep = z.infer<typeof stepSchama.talk>
type ActStep = z.infer<typeof stepSchama.act>
type MoveStep = z.infer<typeof stepSchama.move>

const makeNewStep = {
    talk: (): TalkStep => ({ time: 100, text: "", animation: undefined }),
    act: (): ActStep => ({ duration: 100, reverse: false, animation: '' }),
    move: (): MoveStep => ({ speed: 100, x: 0, y: 0, animation: '' }),
}

export class OrderForm extends Component<Props> {
    constructor(props: Props) {
        super(props)
        this.changeStep = this.changeStep.bind(this)
    }

    changeValue(propery: keyof Order, newValue: string | undefined | Order['steps']) {
        const { data, updateData } = this.props
        switch (propery) {
            case 'type': {
                if (orderTypes.includes(newValue as OrderType)) {
                    updateData(getDefaultOrder(newValue as OrderType))
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
        this.changeValue('steps', stepListCopy as Order['steps'])
    }

    render() {
        const { type, steps } = this.props.data

        return (
            <article>
                <div class={styles.container} style={{alignItems:'flex-start'}}>
                    <SelectInput label="order type"
                        value={type}
                        items={orderTypes}
                        onSelect={newValue => this.changeValue('type', newValue)}
                    />

                    {type === 'talk' && (
                        <ListEditor
                            list={steps}
                            describeItem={(step, index) => (
                                <SchemaForm key={index}
                                    changeValue={(value, field) => { this.changeStep(value, field, index) }}
                                    data={step}
                                    schema={stepSchama[type]} />
                            )}
                            mutateList={(newList) => this.changeValue('steps', newList)}
                            createItem={makeNewStep[type]}
                        />
                    )}
                    {type === 'act' && (
                        <ListEditor
                            list={steps}
                            describeItem={(step, index) => (
                                <SchemaForm key={index}
                                    changeValue={(value, field) => { this.changeStep(value, field, index) }}
                                    data={step}
                                    schema={stepSchama[type]} />
                            )}
                            mutateList={(newList) => this.changeValue('steps', newList)}
                            createItem={makeNewStep[type]}
                        />
                    )}
                    {type === 'move' && (
                        <ListEditor
                            list={steps}
                            describeItem={(step, index) => (
                                <SchemaForm key={index}
                                    changeValue={(value, field) => { this.changeStep(value, field, index) }}
                                    data={step}
                                    schema={stepSchama[type]} />
                            )}
                            mutateList={(newList) => this.changeValue('steps', newList)}
                            createItem={makeNewStep[type]}
                        />
                    )}
                </div>
            </article>
        )
    }
}