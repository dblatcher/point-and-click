/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, Component } from "preact"
import { orderTypes, SayOrder, SayOrderSchema } from "../../../definitions/Order";
import { SelectInput } from "../formControls";
import { SchemaForm, getModification, FieldValue, FieldDef } from "../SchemaForm";


type OrderWithoutSteps = SayOrder

interface Props {
    data: OrderWithoutSteps;
    animationSuggestions?: string[];
    updateData: { (data: OrderWithoutSteps): void };
    changeType: { (type: string): void };
}

export class OrderWithoutStepsForm extends Component<Props> {

    constructor(props: Props) {
        super(props)
        this.changeValue = this.changeValue.bind(this)
        this.handleSchemaFormChange = this.handleSchemaFormChange.bind(this)
    }

    changeValue(propery: keyof OrderWithoutSteps, newValue: string | undefined | number) {
        const { changeType } = this.props
        switch (propery) {
            case 'type': {
                changeType(newValue as string)
                break;
            }
        }
    }

    handleSchemaFormChange(value: FieldValue, field: FieldDef) {
        const { data, updateData } = this.props
        const mod = getModification(value, field)
        console.log(mod)

        updateData({ ...data, ...mod })
    }

    render() {
        const { type } = this.props.data
        const { animationSuggestions } = this.props
        const { changeValue } = this

        return (
            <article style={{ flex: 1 }}>
                <SelectInput label="order type"
                    value={type}
                    items={orderTypes}
                    onSelect={newValue => changeValue('type', newValue)}
                />

                {type === 'say' && (
                    <SchemaForm
                        schema={SayOrderSchema}
                        data={this.props.data}
                        changeValue={this.handleSchemaFormChange}
                        suggestions={{ animation: animationSuggestions }}
                    />
                )}
            </article>
        )
    }
}