
import { FieldDef, FieldValue, getModification, SchemaForm } from "@/components/SchemaForm";
import { GotoOrder, GotoOrderSchema, SayOrder, SayOrderSchema } from "@/definitions/Order";
import { Component } from "react";


type OrderWithoutSteps = SayOrder | GotoOrder

interface Props {
    data: OrderWithoutSteps;
    animationSuggestions: string[];
    targetIdOptions: string[];
    targetIdDescriptions: string[];
    updateData: { (data: OrderWithoutSteps): void };
}

export class OrderWithoutStepsForm extends Component<Props> {

    constructor(props: Props) {
        super(props)
        this.handleSchemaFormChange = this.handleSchemaFormChange.bind(this)
    }

    handleSchemaFormChange(value: FieldValue, field: FieldDef) {
        const { data, updateData } = this.props
        const mod = getModification(value, field)
        updateData({ ...data, ...mod })
    }

    render() {
        const { type } = this.props.data
        const { animationSuggestions, targetIdOptions, targetIdDescriptions } = this.props

        return (
            <>
                {type === 'say' && (
                    <SchemaForm
                        schema={SayOrderSchema.omit({ _started: true })}
                        data={this.props.data}
                        changeValue={this.handleSchemaFormChange}
                        suggestions={{ animation: animationSuggestions }}
                    />
                )}
                {type === 'goTo' && (
                    <SchemaForm
                        schema={GotoOrderSchema}
                        data={this.props.data}
                        changeValue={this.handleSchemaFormChange}
                        suggestions={{
                            animation: animationSuggestions,
                        }}
                        // to do - exclude the id and description for the order's actorId
                        options={{
                            targetId: targetIdOptions,
                        }}
                        optionDescriptions={{
                            targetId: targetIdDescriptions
                        }}
                    />
                )}
            </>
        )
    }
}