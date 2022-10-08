/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { z, ZodType } from "zod"
import { h, VNode } from "preact";
import { CheckBoxInput, NumberInput, OptionalNumberInput, SelectInput, StringInput, TriStateInput } from "./formControls";
import styles from './editorStyles.module.css';

export interface FieldDef {
    key: string;
    optional: boolean;
    type: string;
    value: unknown;
    enumOptions?: string[];
}
export type FieldValue = string | number | boolean | undefined;

type NumberInputSettings = {
    min?: number;
    max?: number;
    step?: number;
}

interface Props<T extends z.ZodRawShape> {
    schema: z.ZodObject<T>;
    data: Record<string, unknown>;
    changeValue: { (value: FieldValue, field: FieldDef): void };
    options?: Partial<Record<keyof T, string[]>>;
    optionDescriptions?: Partial<Record<keyof T, string[]>>;
    suggestions?: Partial<Record<keyof T, string[]>>;
    numberConfig?: Partial<Record<keyof T, NumberInputSettings>>;
}

function fieldValueIsRightType(value: FieldValue, field: FieldDef): boolean {

    if (field.type === 'ZodEnum') {
        return field.enumOptions?.includes(value as string) || false
    }
    switch (typeof value) {
        case 'undefined': return field.optional;
        case 'string': return field.type === 'ZodString';
        case 'number': return field.type === 'ZodNumber';
        case 'boolean': return field.type === 'ZodBoolean';
        default: return false;
    }
}

export function getModification(value: FieldValue, field: FieldDef): Record<string, FieldValue> {
    if (fieldValueIsRightType(value, field)) {
        const mod: Record<string, FieldValue> = {};
        mod[field.key] = value
        return mod
    }
    return {}
}

interface SchemaFieldProps<T> {
    field: FieldDef;
    noTriState?: boolean;
    change: { (value: FieldValue, field: FieldDef): void };
    options?: string[];
    optionDescriptions?: string[];
    suggestions?: string[];
    stringInputType?: string;
    showUnsupported?: boolean;
    numberInputSettings?: NumberInputSettings;
}

function SchemaField<T extends z.ZodRawShape>({
    field, change, noTriState,
    options, optionDescriptions,
    suggestions, stringInputType,
    showUnsupported = false,
    numberInputSettings = {}
}: SchemaFieldProps<T>): VNode | null {
    const { key, optional, type, value } = field;
    const isSupported = ['ZodString', 'ZodBoolean', 'ZodNumber', 'ZodEnum'].includes(type)
    if (!isSupported && !showUnsupported) { return null }

    let safeValue: FieldValue
    switch (typeof value) {
        case 'string':
        case 'boolean':
        case 'number':
            safeValue = value;
    }

    function buildInput(): VNode | null {

        if (type === 'ZodString' && (typeof value === 'string' || typeof value === 'undefined')) {
            if (options) {
                return <SelectInput label={key}
                    value={value || ''}
                    onSelect={value => change(value, field)}
                    items={options}
                    descriptions={optionDescriptions}
                    haveEmptyOption={optional}
                    emptyOptionLabel={`[no ${key}]`}
                />
            }

            return <StringInput label={key}
                value={value || ''}
                type={stringInputType}
                suggestions={suggestions}
                inputHandler={(value) => { change(value, field) }}
            />

        }

        if (type === 'ZodBoolean' && (typeof value === 'boolean' || typeof value === 'undefined')) {
            if (noTriState || !optional) {
                return <CheckBoxInput label={key}
                    value={value}
                    inputHandler={(value): void => { change(value, field) }}
                />

            }
            return <TriStateInput label={key}
                value={value}
                inputHandler={(value): void => { change(value, field) }}
            />
        }

        if (type === 'ZodNumber') {

            if (typeof value === 'number' || typeof value === 'undefined') {
                return field.optional ? (
                    <OptionalNumberInput label={key}
                        {...numberInputSettings}
                        value={value}
                        inputHandler={(value) => { change(value, field) }}
                    />
                ) : (
                    <NumberInput label={key}
                        {...numberInputSettings}
                        value={value || 0}
                        inputHandler={(value) => { change(value, field) }}
                    />
                )
            }
        }

        if (type === 'ZodEnum' && !optional && field.enumOptions) {

            if ((typeof value === 'string')) {
                return <SelectInput label={key}
                    value={value}
                    onSelect={value => change(value, field)}
                    items={field.enumOptions}
                />
            }
        }

        if (showUnsupported) {
            return (
                <div key={key}>
                    <b>UNSUPPORTED | </b>
                    {key} |{type}
                    <b>{safeValue?.toString()}</b>
                </div>
            )
        }

        return null
    }

    return (
        <div className={styles.formRow}>
            {buildInput()}
            <span>{field.optional ? '(opt)' : '(req)'}</span>
        </div>
    )
}

/**
 * Creates a form for the schema, Supports only primitives, optional primitives
 * and required string enums.
 */
export function SchemaForm<T extends z.ZodRawShape>({
    schema, data, changeValue, options = {}, optionDescriptions = {}, numberConfig = {}, suggestions = {}
}: Props<T>): VNode {

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