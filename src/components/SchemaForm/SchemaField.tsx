import { z } from "zod"
import { ReactNode } from "react";
import { CheckBoxInput, NumberInput, OptionalNumberInput, SelectInput, StringInput, TriStateInput } from "../GameEditor/formControls";
import editorStyles from '../GameEditor/editorStyles.module.css';
import type { FieldValue, FieldDef, NumberInputSettings } from "./types"

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

export function SchemaField<T extends z.ZodRawShape>({
    field, change, noTriState,
    options, optionDescriptions,
    suggestions, stringInputType,
    showUnsupported = false,
    numberInputSettings = {}
}: SchemaFieldProps<T>) {
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

    function buildInput(): ReactNode | null {

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
        <div className={editorStyles.formRow}>
            {buildInput()}
            <span>{field.optional ? '(opt)' : '(req)'}</span>
        </div>
    )
}