import { z } from "zod"
import type { FieldValue, FieldDef, NumberInputSettings } from "./types"
import { SchemaField } from "./SchemaField"
import { Stack, Typography, StackProps, TypographyProps, } from "@mui/material"
import { ReactNode } from "react"

export type { FieldValue, FieldDef, NumberInputSettings }
export { getModification } from "./getModification"

interface Props<T extends z.ZodRawShape> {
    formLegend?: string
    schema: z.ZodObject<T>;
    data: Record<string, unknown>;
    changeValue: { (value: FieldValue, field: FieldDef): void };
    options?: Partial<Record<keyof T, string[]>>;
    fieldAliases?: Partial<Record<keyof T, string>>;
    optionDescriptions?: Partial<Record<keyof T, ReactNode[]>>;
    suggestions?: Partial<Record<keyof T, string[]>>;
    numberConfig?: Partial<Record<keyof T, NumberInputSettings>>;
    containerProps?: Partial<StackProps>
    legendProps?: Omit<Partial<TypographyProps>, 'component' | 'children' | 'ref'>
    fieldWrapperProps?: Omit<Partial<StackProps>, 'component' | 'children' | 'ref'>
    textInputDelay?: number
}


/**
 * Creates a form for the schema, Supports only primitives, optional primitives
 * and required string enums.
 */
export function SchemaForm<T extends z.ZodRawShape>({
    formLegend, schema, data,
    changeValue,
    options = {}, optionDescriptions = {}, numberConfig = {}, suggestions = {}, fieldAliases = {},
    containerProps: containerProps = {}, legendProps = {}, fieldWrapperProps = {},
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

        fields.push({
            key,
            alias: fieldAliases[key],
            optional: zod.isOptional(),
            type,
            value: data[key],
            enumOptions: zod._def.typeName === 'ZodEnum' ? zod._def.values : undefined,
        })
    }



    return <Stack component={'article'} {...containerProps}  >
        {formLegend && <Typography variant='h5' component={'legend'} {...legendProps}>{formLegend}</Typography>}
        <Stack spacing={1} {...fieldWrapperProps}>
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
    </Stack>
}