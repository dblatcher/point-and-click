import { z } from "zod"
import { h, FunctionalComponent, VNode } from "preact";
import { CheckBoxInput, TextInput, TriStateInput } from "./formControls";
import { eventToString } from "../../lib/util";


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
}

interface SchemaFieldProps<T> {
    field: FieldDef;
    noTriState?: boolean;
    change: { (value: FieldValue, field: FieldDef): void };
}

export function SchemaField<T extends z.ZodRawShape>({ field, change, noTriState }: SchemaFieldProps<T>): VNode {

    const { key, optional, type, value } = field;

    let safeValue: FieldValue
    switch (typeof value) {
        case 'string':
        case 'boolean':
        case 'number':
            safeValue = value;
    }

    if (type === 'ZodString' && (typeof value === 'string' || typeof value === 'undefined')) {
        return <div>
            <TextInput label={key}
                value={value || ''}
                onInput={(event): void => { change(eventToString(event), field) }}
            />
            {field.optional && <span>(optional)</span>}
        </div>
    }

    if (type === 'ZodBoolean' && (typeof value === 'boolean' || typeof value === 'undefined')) {
        if (noTriState || !optional) {
            return <div>
                <CheckBoxInput label={key}
                    value={value}
                    inputHandler={(value): void => { change(value, field) }}
                />
            </div>
        }
        return <div>
            <TriStateInput label={key}
                value={value}
                inputHandler={(value): void => { change(value, field) }}
            />
            <span>(optional)</span>
        </div>
    }


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


export function SchemaForm<T extends z.ZodRawShape>({ schema, data, changeValue }: Props<T>): VNode {

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
        Schema form
        {fields.map(field =>
            <SchemaField key={field.key}
                noTriState
                change={changeValue}
                field={field} />
        )}

    </article>
}