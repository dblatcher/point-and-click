import { Box, Stack, StackProps } from "@mui/material"
import { Fragment, ReactNode } from "react"
import { objectOutputType, ZodTypeAny, ZodRawShape, ZodBoolean, ZodEnum, ZodNumber, ZodObject, ZodString } from "zod"
import { SchemaField } from "./SchemaField"
import type { FieldDef, NumberInputSettings } from "./types"

interface Props<DataShape extends ZodRawShape> {
    schema: ZodObject<DataShape>;
    changeValue: { (mod: Partial<objectOutputType<DataShape, ZodTypeAny>>): void };
    textInputDelay?: number
    data: objectOutputType<DataShape, ZodTypeAny>;
    options?: Partial<Record<keyof DataShape, string[]>>;
    fieldAliases?: Partial<Record<keyof DataShape, string>>;
    optionDescriptions?: Partial<Record<keyof DataShape, ReactNode[]>>;
    suggestions?: Partial<Record<keyof DataShape, string[]>>;
    numberConfig?: Partial<Record<keyof DataShape, NumberInputSettings>>;
    fieldWrapperProps?: Omit<Partial<StackProps>, 'component' | 'children' | 'ref'>
    customContentAfter?: Partial<Record<keyof DataShape, ReactNode>>
}

const getType = (typeName: string): FieldDef['type'] => {
    if (typeName === "ZodString") {
        return 'ZodString'
    }
    if (typeName === "ZodBoolean") {
        return 'ZodBoolean'
    }
    if (typeName === "ZodEnum") {
        return 'ZodEnum'
    }
    if (typeName === "ZodNumber") {
        return 'ZodNumber'
    }
    console.warn('TYPE GET FAIL!', typeName)
}

/**
 * Creates a form for the schema, Supports only primitives, optional primitives
 * and required string enums.
 */
export function SchemaForm<DataShape extends ZodRawShape>({
    schema, data,
    changeValue,
    options = {}, optionDescriptions = {}, numberConfig = {}, suggestions = {}, fieldAliases = {},
    fieldWrapperProps = {},
    textInputDelay,
    customContentAfter = {},
}: Props<DataShape>) {
    const fields: FieldDef[] = []
    for (const key in schema.shape) {
        const zod = schema.shape[key];
        const optional = zod.isOptional();
        const type = optional ? getType(zod._def.innerType._def.typeName) : getType(zod._def.typeName)
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
                    alignItems={'flex-start'} >
                    {renderField()}
                    {extraContent}
                </Box>
            }

            return <Fragment key={field.key}>
                {renderField()}
            </Fragment>
        })}
    </Stack>
}