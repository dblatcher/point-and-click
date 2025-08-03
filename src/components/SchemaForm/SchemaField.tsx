import { z } from "zod"
import type { FieldValue, FieldDef, NumberInputSettings } from "./types"
import { TriStateInput } from "./TristateInput";
import { StringInput } from "./StringInput";
import { BooleanInput } from "./BooleanInput";
import { SelectInput } from "./SelectInput";
import { NumberInput } from "./NumberInput";
import { OptionalNumberInput } from "./OptionalNumberInput";
import { DelayedStringInput } from "../GameEditor/DelayedStringInput";
import { ReactNode } from "react";

// noTriState is set by default in SchemaForm, so no implementation of the
// TriStateInput is currently needed

interface SchemaFieldProps<T> {
    field: FieldDef;
    noTriState?: boolean;
    change: { (value: FieldValue, field: FieldDef): void };
    options?: string[];
    optionDescriptions?: ReactNode[];
    suggestions?: string[];
    stringInputType?: string;
    showUnsupported?: boolean;
    numberInputSettings?: NumberInputSettings;
    textInputDelay?: number;
}

export function SchemaField<T extends z.ZodRawShape>({
    field, change, noTriState,
    options, optionDescriptions,
    suggestions, stringInputType,
    showUnsupported = false,
    numberInputSettings = {},
    textInputDelay,
}: SchemaFieldProps<T>) {
    const { key, optional, type, value, alias } = field;
    const isSupported = ['ZodString', 'ZodBoolean', 'ZodNumber', 'ZodEnum'].includes(type)
    if (!isSupported && !showUnsupported) { return null }

    let safeValue: FieldValue
    switch (typeof value) {
        case 'string':
        case 'boolean':
        case 'number':
            safeValue = value;
    }

    if (type === 'ZodString' && (typeof value === 'string' || typeof value === 'undefined')) {
        if (options) {
            return <SelectInput label={alias ?? key}
                value={value || ''}
                inputHandler={value => change(value, field)}
                options={options}
                optional={optional}
                descriptions={optionDescriptions}
            />
        }

        return textInputDelay
            ? <DelayedStringInput label={alias ?? key}
                value={value || ''}
                type={stringInputType}
                suggestions={suggestions}
                inputHandler={(value) => { change(value, field) }}
                delayAfterEdits={textInputDelay}
            />
            : <StringInput label={alias ?? key}
                value={value || ''}
                type={stringInputType}
                suggestions={suggestions}
                inputHandler={(value) => { change(value, field) }}
            />
    }

    if (type === 'ZodBoolean' && (typeof value === 'boolean' || typeof value === 'undefined')) {
        if (noTriState || !optional) {
            return <BooleanInput label={alias ?? key}
                value={value ?? false}
                inputHandler={(value): void => { change(value, field) }}
            />
        }
        return <TriStateInput label={alias ?? key}
            value={value}
            inputHandler={(value): void => { change(value, field) }}
        />
    }

    if (type === 'ZodNumber') {
        if (typeof value === 'number' || typeof value === 'undefined') {
            return field.optional ? (
                <OptionalNumberInput label={alias ?? key}
                    {...numberInputSettings}
                    value={value}
                    inputHandler={(value) => { change(value, field) }}
                />
            ) : (
                <NumberInput label={alias ?? key}
                    {...numberInputSettings}
                    value={value || 0}
                    inputHandler={(value) => { change(value, field) }}
                />
            )
        }
    }

    if (type === 'ZodEnum' && !optional && field.enumOptions) {
        if ((typeof value === 'string')) {
            return <SelectInput label={alias ?? key}
                value={value}
                inputHandler={value => change(value, field)}
                options={field.enumOptions}
                optional={optional}
                descriptions={optionDescriptions}
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