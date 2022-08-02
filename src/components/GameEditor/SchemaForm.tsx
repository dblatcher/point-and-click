/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { z } from "zod"
import { h, VNode } from "preact";
import { CheckBoxInput, NumberInput, SelectInput, TextInput, TriStateInput } from "./formControls";
import { eventToString } from "../../lib/util";
import styles from './editorStyles.module.css';

export interface FieldDef {
    key: string;
    optional: boolean;
    type: string;
    value: unknown;
}
export type FieldValue = string | number | boolean | undefined;

interface Props<T extends z.ZodRawShape> {
    schema: z.ZodObject<T>;
    data: Record<string, unknown>;
    changeValue: { (value: FieldValue, field: FieldDef): void };
    options?: Partial<Record<keyof T, string[]>>;
}

interface SchemaFieldProps<T> {
    field: FieldDef;
    noTriState?: boolean;
    change: { (value: FieldValue, field: FieldDef): void };
    options?: string[];
    showUnsupported?: boolean;
}

export function SchemaField<T extends z.ZodRawShape>({
    field, change, noTriState, options, showUnsupported = false
}: SchemaFieldProps<T>): VNode | null {
    const { key, optional, type, value } = field;
    let safeValue: FieldValue
    switch (typeof value) {
        case 'string':
        case 'boolean':
        case 'number':
            safeValue = value;
    }

    if (type === 'ZodString' && (typeof value === 'string' || typeof value === 'undefined')) {
        if (options) {
            return <div className={styles.formRow}>
                <SelectInput label={key}
                    value={value || ''}
                    onSelect={value => change(value, field)}
                    items={options}
                    haveEmptyOption={optional}
                    emptyOptionLabel={`[no ${key}]`}
                />
            </div>
        }

        return <div className={styles.formRow}>
            <TextInput label={key}
                value={value || ''}
                onInput={(event): void => { change(eventToString(event), field) }}
            />
            <span>{field.optional ? '(opt)' : '(req)'}</span>
        </div>
    }

    if (type === 'ZodBoolean' && (typeof value === 'boolean' || typeof value === 'undefined')) {
        if (noTriState || !optional) {
            return <div className={styles.formRow}>
                <CheckBoxInput label={key}
                    value={value}
                    inputHandler={(value): void => { change(value, field) }}
                />
                <span>{field.optional ? '(opt)' : '(req)'}</span>
            </div>
        }
        return <div className={styles.formRow}>
            <TriStateInput label={key}
                value={value}
                inputHandler={(value): void => { change(value, field) }}
            />
            <span>{field.optional ? '(opt)' : '(req)'}</span>
        </div>
    }

    if (type === 'ZodNumber' && (typeof value === 'number' || typeof value === 'undefined')) {
        return <div className={styles.formRow}>
            <NumberInput label={key}
                value={value || 0}
                inputHandler={(value) => { change(value, field) }}
            />
            <span>{field.optional ? '(opt)' : '(req)'}</span>
        </div>
    }

    if (showUnsupported) {
        return (
            <section key={key}>
                <b>UNSUPPORTED | </b>
                <span>{key} | </span>
                {optional && <span>(optional) | </span>}
                <span>{type}</span>
                <b>{safeValue?.toString()}</b>
            </section>
        )
    }

    return null
}

/**
 * Creates a form for the schema, Supports only primitives and optional primitives
 */
export function SchemaForm<T extends z.ZodRawShape>({
    schema, data, changeValue, options = {}
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
        })
    }

    return <article>
        {fields.map(field =>
            <SchemaField key={field.key}
                noTriState
                options={options[field.key]}
                change={changeValue}
                field={field}
            />
        )}
    </article>
}