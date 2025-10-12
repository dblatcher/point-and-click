import { Stack, StackProps } from "@mui/material"
import { ReactNode } from "react"
import { z } from "zod"
import { SchemaField } from "./SchemaField"
import type { FieldDef, FieldValue, NumberInputSettings } from "./types"

export type { FieldDef, FieldValue, NumberInputSettings }

interface Props<T extends z.ZodRawShape> {
    schema: z.ZodObject<T>;
    data: Record<string, unknown>;
    changeValue: { (mod: Partial<T>): void };
    options?: Partial<Record<keyof T, string[]>>;
    fieldAliases?: Partial<Record<keyof T, string>>;
    optionDescriptions?: Partial<Record<keyof T, ReactNode[]>>;
    suggestions?: Partial<Record<keyof T, string[]>>;
    numberConfig?: Partial<Record<keyof T, NumberInputSettings>>;
    fieldWrapperProps?: Omit<Partial<StackProps>, 'component' | 'children' | 'ref'>
    textInputDelay?: number
}

// if this fails becuase of version/import hell when
// making definitions a package, switch to accessing the typeName
// zod._def.innerType._def.typeName === 'ZodEnum'
// zod._def.typeName === 'ZodEnum'
const getType = (zodExtract: unknown): FieldDef['type'] => {
    if (zodExtract instanceof z.ZodString) {
        return 'ZodString'
    }
    if (zodExtract instanceof z.ZodBoolean) {
        return 'ZodBoolean'
    }
    if (zodExtract instanceof z.ZodEnum) {
        return 'ZodEnum'
    }
    if (zodExtract instanceof z.ZodNumber) {
        return 'ZodNumber'
    }
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
        const zod = schema.shape[key];
        const optional = zod.isOptional();
        const type = optional ? getType(zod._def.innerType) : getType(zod)
        const enumOptions = type === 'ZodEnum'
            ? optional 
                ? zod._def.innerType._def.values 
                : zod._def.values
            : undefined;

        fields.push({
            key,
            alias: fieldAliases[key],
            optional,
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
                schema={schema}
            />
        )}
    </Stack>
}