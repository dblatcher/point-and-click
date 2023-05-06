import { z } from "zod"
import type { FieldValue, FieldDef, NumberInputSettings } from "./types"
import { SchemaField } from "./SchemaField"

export type { FieldValue, FieldDef, NumberInputSettings }
export { getModification } from "./getModification"

interface Props<T extends z.ZodRawShape> {
    schema: z.ZodObject<T>;
    data: Record<string, unknown>;
    changeValue: { (value: FieldValue, field: FieldDef): void };
    options?: Partial<Record<keyof T, string[]>>;
    optionDescriptions?: Partial<Record<keyof T, string[]>>;
    suggestions?: Partial<Record<keyof T, string[]>>;
    numberConfig?: Partial<Record<keyof T, NumberInputSettings>>;
}


/**
 * Creates a form for the schema, Supports only primitives, optional primitives
 * and required string enums.
 */
export function SchemaForm<T extends z.ZodRawShape>({
    schema, data, changeValue, options = {}, optionDescriptions = {}, numberConfig = {}, suggestions = {}
}: Props<T>) {

    const fields: FieldDef[] = []
    for (const key in schema.shape) {
        const zod = schema.shape[key]

        let type: string;
        if (zod.isOptional()) {
            type = zod._def.innerType._def.typeName
        } else {
            type = zod._def.typeName
        }

        fields.push({
            key,
            optional: zod.isOptional(),
            type,
            value: data[key],
            enumOptions: zod._def.typeName === 'ZodEnum' ? zod._def.values : undefined,
        })
    }

    return <article>
        {fields.map(field =>
            <SchemaField key={field.key}
                noTriState
                options={options[field.key]}
                optionDescriptions={optionDescriptions[field.key]}
                suggestions={suggestions[field.key]}
                numberInputSettings={numberConfig[field.key]}
                change={changeValue}
                field={field}
                stringInputType={field.key === 'text' ? 'textArea' : undefined}
            />
        )}
    </article>
}