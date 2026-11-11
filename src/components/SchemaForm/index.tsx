import { Box, Stack, StackProps } from "@mui/material"
import { Fragment, ReactNode } from "react"
import { ZodEnum, ZodObject, ZodOptional, ZodType } from "zod"
import { SchemaField } from "./SchemaField"
import type { FieldDef, NumberInputSettings, SupportedData } from "./types"

interface Props<T extends SupportedData> {
    schema: ZodObject<Record<keyof T, ZodType>>;
    changeValue: { (mod: Partial<T>): void };
    textInputDelay?: number
    data: T;
    options?: Partial<Record<keyof T, string[]>>;
    fieldAliases?: Partial<Record<keyof T, string>>;
    optionDescriptions?: Partial<Record<keyof T, ReactNode[]>>;
    suggestions?: Partial<Record<keyof T, string[]>>;
    numberConfig?: Partial<Record<keyof T, NumberInputSettings>>;
    fieldWrapperProps?: Omit<Partial<StackProps>, 'component' | 'children' | 'ref'>
    customContentAfter?: Partial<Record<keyof T, ReactNode>>
}

const checkZodTypeSupported = (typeName: string): FieldDef['type'] => {
    switch (typeName) {
        case 'string':
        case 'boolean':
        case 'enum':
        case 'number':
            return typeName
    }
    console.warn('Unsupported Zod Type', typeName)
    return undefined
}

/**
 * Creates a form for the schema, Supports only primitives, optional primitives
 * and required string enums.
 */
export function SchemaForm<T extends SupportedData>({
    schema, data,
    changeValue,
    options = {}, optionDescriptions = {}, numberConfig = {}, suggestions = {}, fieldAliases = {},
    fieldWrapperProps = {},
    textInputDelay,
    customContentAfter = {},
}: Props<T>) {
    const fields: FieldDef[] = []
    for (const key in schema.shape) {
        const zod = schema.shape[key];
        const optional = zod.safeParse(undefined).success;
        const type = zod.type === 'optional'
            ? checkZodTypeSupported((zod as ZodOptional).unwrap()._zod.def.type)
            : checkZodTypeSupported(zod.type)
        const enumOptions = zod.type === 'enum'
            ? optional
                ? Object.keys((zod as ZodEnum).def.entries)
                : Object.keys((zod as ZodEnum).def.entries)
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
        {fields.map(field => {
            const extraContent = customContentAfter[field.key];
            const renderField = () => <SchemaField
                noTriState
                options={options[field.key]}
                optionDescriptions={optionDescriptions[field.key]}
                suggestions={suggestions[field.key]}
                numberInputSettings={numberConfig[field.key]}
                changeValue={changeValue}
                field={field}
                stringInputType={field.key === 'text' ? 'textArea' : undefined}
                textInputDelay={textInputDelay}
                schema={schema}
            />

            if (extraContent) {
                return <Box key={field.key}
                    display={'flex'}
                    justifyContent={'space-between'}
                    gap={2}
                    flexWrap={'wrap'}
                    alignItems={'flex-start'} >
                    <Box>{renderField()}</Box>
                    <Box>{extraContent}</Box>
                </Box>
            }

            return <Fragment key={field.key}>
                {renderField()}
            </Fragment>
        })}
    </Stack>
}