
import { FieldDef, FieldValue, getModification, SchemaForm } from "@/components/SchemaForm";
import { GotoOrder, GotoOrderSchema, SayOrder, SayOrderSchema } from "@/definitions/Order";
import { excludeByIndex } from "@/lib/util";
import { Component, ReactNode } from "react";


type OrderWithoutSteps = SayOrder | GotoOrder

interface Props {
    actorId?: string;
    data: OrderWithoutSteps;
    animationSuggestions: string[];
    targetIdOptions: string[];
    targetIdDescriptions: ReactNode[];
    updateData: { (data: OrderWithoutSteps): void };
}

const excludeActor = (actorId: string | undefined, targetIdOptions: string[], targetIdDescriptions: ReactNode[]) => {
    const indexOfActorDoingOrder = actorId ? targetIdOptions.indexOf(actorId) : -1;

    if (indexOfActorDoingOrder === -1) {
        return { targetIdOptions, targetIdDescriptions }
    }
    return {
        targetIdOptions: excludeByIndex(indexOfActorDoingOrder, targetIdOptions),
        targetIdDescriptions: excludeByIndex(indexOfActorDoingOrder, targetIdDescriptions)
    }
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
        const { animationSuggestions, targetIdOptions, targetIdDescriptions, actorId } = this.props
        const withoutActor = excludeActor(actorId, targetIdOptions, targetIdDescriptions);

        return (
            <>
                {type === 'say' && (
                    <SchemaForm
                        textInputDelay={5000}
                        schema={SayOrderSchema.omit({ _started: true })}
                        data={this.props.data}
                        changeValue={this.handleSchemaFormChange}
                        suggestions={{ animation: animationSuggestions }}
                    />
                )}
                {type === 'goTo' && (
                    <SchemaForm
                        textInputDelay={1000}
                        schema={GotoOrderSchema.omit({ _started: true })}
                        data={this.props.data}
                        changeValue={this.handleSchemaFormChange}
                        suggestions={{
                            animation: animationSuggestions,
                        }}
                        options={{
                            targetId: withoutActor.targetIdOptions,
                        }}
                        optionDescriptions={{
                            targetId: withoutActor.targetIdDescriptions
                        }}
                    />
                )}
            </>
        )
    }
}