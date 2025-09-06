
import { FieldDef, FieldValue, getModification, SchemaForm } from "@/components/SchemaForm";
import { orderBaseOmits, SayOrder, SayOrderSchema } from "@/definitions/Order";


interface Props {
    actorId?: string;
    data: SayOrder;
    animationSuggestions: string[];
    updateData: { (data: SayOrder): void };
}

export const SayOrderForm = ({
    data,
    animationSuggestions,
    updateData,
}: Props) => {

    const handleSchemaFormChange = (value: FieldValue, field: FieldDef) => {
        const mod = getModification(value, field)
        updateData({ ...data, ...mod })
    }

    return <SchemaForm
        textInputDelay={5000}
        schema={SayOrderSchema.omit(orderBaseOmits)}
        data={data}
        changeValue={handleSchemaFormChange}
        suggestions={{ animation: animationSuggestions }}
    />
}