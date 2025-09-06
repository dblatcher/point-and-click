
import { FieldDef, FieldValue, getModification, SchemaForm } from "@/components/SchemaForm";
import { GotoOrder, GotoOrderSchema, orderBaseOmits } from "@/definitions/Order";
import { excludeByIndex } from "@/lib/util";
import { ReactNode } from "react";


interface Props {
    actorId?: string;
    data: GotoOrder;
    animationSuggestions: string[];
    targetIdOptions: string[];
    targetIdDescriptions: ReactNode[];
    updateData: { (data: GotoOrder): void };
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

export const GoToOrderForm = ({
    actorId,
    data,
    animationSuggestions,
    targetIdOptions,
    targetIdDescriptions,
    updateData,
}: Props) => {

    const handleSchemaFormChange = (value: FieldValue, field: FieldDef) => {
        const mod = getModification(value, field)
        updateData({ ...data, ...mod })
    }

    const withoutActor = excludeActor(actorId, targetIdOptions, targetIdDescriptions);

    return <SchemaForm
        textInputDelay={1000}
        schema={GotoOrderSchema.omit(orderBaseOmits)}
        data={data}
        changeValue={handleSchemaFormChange}
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
}