
import { SchemaForm } from "@/components/SchemaForm";
import { orderBaseOmits, SayOrder, SayOrderSchema } from "point-click-lib";


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

    const handleSchemaFormChange = (mod: Partial<SayOrder>) => {
        updateData({ ...data, ...mod })
    }

    return <SchemaForm
        textInputDelay={2000}
        schema={SayOrderSchema.omit(orderBaseOmits)}
        data={data}
        changeValue={handleSchemaFormChange}
        suggestions={{ animation: animationSuggestions }}
    />
}