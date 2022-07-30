/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, Component, Fragment } from "preact"
import styles from "../editorStyles.module.css"
import { Order, OrderType, orderTypes, TalkOrder, TalkOrderSchema } from "../../../definitions/Order";
import { SelectInput } from "../formControls";
import { getDefaultOrder } from "../defaults";
import { ListEditor } from "../ListEditor";
import { FieldDef, SchemaForm } from "../SchemaForm";
import { z } from "zod";

interface Props {
    data: Order;
    updateData: { (data: Order): void };
}

const TalkStepSchema = TalkOrderSchema.shape.steps.element
type TalkStep = z.infer<typeof TalkStepSchema>

export class OrderForm extends Component<Props> {

    constructor(props: Props) {
        super(props)

        this.changeTalkStep = this.changeTalkStep.bind(this)
    }

    changeValue(propery: keyof Order, newValue: string | undefined | TalkOrder['steps']) {
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
                break;
            }
        }
    }

    changeTalkStep(value: string | number | boolean | undefined, field: FieldDef, index: number) {
        const { data } = this.props
        if (data.type !== 'talk' || !data.steps[index]) {
            return
        }

        const stepCopy: Record<string, unknown> = Object.assign({}, data.steps[index])
        stepCopy[field.key] = value
        const result = TalkStepSchema.safeParse(stepCopy)
        if (!result.success) { return }
        const stepListCopy = [...data.steps]
        stepListCopy.splice(index, 1, result.data)
        this.changeValue('steps', stepListCopy)
    }

    render() {
        const { type, steps } = this.props.data

        return (
            <article>
                <div class={styles.container}>
                    <SelectInput label="Type"
                        value={type}
                        items={orderTypes}
                        onSelect={newValue => this.changeValue('type', newValue)}
                    />
                </div>
                <div class={styles.container}>
                    <p>steps: {steps.length}</p>
                    {type === 'talk' && (
                        <ListEditor
                            list={steps}
                            describeItem={(step, index) => (

                                <SchemaForm key={index}
                                    changeValue={(value, field) => { this.changeTalkStep(value, field, index) }}
                                    data={step}
                                    schema={TalkStepSchema} />
                            )}
                            mutateList={(newList) => this.changeValue('steps', newList)}
                            createItem={() => ({ text: "", time: 100, animation: undefined })}
                        />
                    )}
                </div>
            </article>
        )
    }
}