import { Stack, StackProps } from "@mui/material"
import { ReactNode } from "react"
import { z } from "zod"
import { SchemaField } from "./SchemaField"
import type { FieldDef, FieldValue, NumberInputSettings } from "./types"

export { getModification } from "./getModification"
export type { FieldDef, FieldValue, NumberInputSettings }

interface Props<T extends z.ZodRawShape> {
    schema: z.ZodObject<T>;
    data: Record<string, unknown>;
    changeValue: { (value: FieldValue, field: FieldDef): void };
    options?: Partial<Record<keyof T, string[]>>;
    fieldAliases?: Partial<Record<keyof T, string>>;
    optionDescriptions?: Partial<Record<keyof T, ReactNode[]>>;
    suggestions?: Partial<Record<keyof T, string[]>>;
    numberConfig?: Partial<Record<keyof T, NumberInputSettings>>;
    fieldWrapperProps?: Omit<Partial<StackProps>, 'component' | 'children' | 'ref'>
    textInputDelay?: number
}


/**
 * Creates a form for the schema, Supports only primitives, optional primitives
 * and required string enums.
 */
export function SchemaForm<T extends z.ZodRawShape>({
    schema, data,
    changeValue,
    options = {}, optionDescriptions = {}, numberConfig = {}, suggestions = {}, fieldAliases = {},
    fieldWrapperProps = {},
    textInputDelay,
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

        const enumOptions = zod._def.typeName === 'ZodEnum'
            ? zod._def.values
            : zod.isOptional() && zod._def.innerType._def.typeName === 'ZodEnum' ? zod._def.innerType._def.values : undefined;

        fields.push({
            key,
            alias: fieldAliases[key],
            optional: zod.isOptional(),
            type,
            value: data[key],
            enumOptions,
        })
    }


    return <Stack spacing={1} {...fieldWrapperProps}>
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
                textInputDelay={textInputDelay}
            />
        )}
    </Stack>
}