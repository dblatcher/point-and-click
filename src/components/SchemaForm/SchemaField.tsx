import { ReactNode } from "react";
import { objectOutputType, ZodObject, ZodRawShape, ZodTypeAny } from "zod";
import { DelayedStringInput } from "../GameEditor/DelayedStringInput";
import { BooleanInput } from "./BooleanInput";
import { NumberInput } from "./NumberInput";
import { OptionalNumberInput } from "./OptionalNumberInput";
import { SelectInput } from "./SelectInput";
import { StringInput } from "./StringInput";
import { TriStateInput } from "./TristateInput";
import { type FieldDef, type NumberInputSettings } from "./types";

// noTriState is set by default in SchemaForm, so no implementation of the
// TriStateInput is currently needed

interface SchemaFieldProps<DataShape extends ZodRawShape> {
    schema: ZodObject<DataShape>;
    changeValue: { (mod: Partial<objectOutputType<DataShape, ZodTypeAny>>): void };
    textInputDelay?: number;
    field: FieldDef;
    noTriState?: boolean;
    options?: string[];
    optionDescriptions?: ReactNode[];
    suggestions?: string[];
    stringInputType?: string;
    showUnsupported?: boolean;
    numberInputSettings?: NumberInputSettings;
}

const describeUnknown = (value: unknown) => {
    switch (typeof value) {
        case 'string':
        case 'boolean':
        case 'number':
        case "bigint":
            return `${typeof value}:[${value.toString()}]`
        case "function":
            return `function:${[value.name]}`
        case "object":
            if (!value) {
                return "[null]"
            }
            return `${typeof value}:[${value.toString()}]`
        case "undefined":
        case "symbol":
            return `[${typeof value}]`
    }
}

export function SchemaField<DataShape extends ZodRawShape>({
    field, changeValue: change, noTriState,
    options, optionDescriptions,
    suggestions, stringInputType,
    showUnsupported = false,
    numberInputSettings = {},
    textInputDelay,
    schema,
}: SchemaFieldProps<DataShape>) {
    const { key, optional, type, value, alias } = field;

    const inputHandler = (value: unknown) => {
        const parseMod = schema.partial().safeParse({ [key]: value })
        if (!parseMod.success) {
            console.error('Bad SchemaField input mod', { [key]: value }, parseMod.error.issues)
            return
        }
        return change(parseMod.data);
    }

    if (type === 'ZodString' && (typeof value === 'string' || typeof value === 'undefined')) {
        if (options) {
            return <SelectInput label={alias ?? key}
                value={value || ''}
                inputHandler={inputHandler}
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
                inputHandler={inputHandler}
                delayAfterEdits={textInputDelay}
            />
            : <StringInput label={alias ?? key}
                value={value || ''}
                type={stringInputType}
                suggestions={suggestions}
                inputHandler={inputHandler}
            />
    }

    if (type === 'ZodBoolean' && (typeof value === 'boolean' || typeof value === 'undefined')) {
        if (noTriState || !optional) {
            return <BooleanInput label={alias ?? key}
                value={value ?? false}
                inputHandler={inputHandler}
            />
        }
        return <TriStateInput label={alias ?? key}
            value={value}
            inputHandler={inputHandler}
        />
    }

    if (type === 'ZodNumber') {
        if (typeof value === 'number' || typeof value === 'undefined') {
            return field.optional ? (
                <OptionalNumberInput label={alias ?? key}
                    {...numberInputSettings}
                    value={value}
                    inputHandler={inputHandler}
                />
            ) : (
                <NumberInput label={alias ?? key}
                    {...numberInputSettings}
                    value={value || 0}
                    inputHandler={inputHandler}
                />
            )
        }
    }

    if (type === 'ZodEnum' && field.enumOptions) {
        if ((typeof value === 'string' || (field.optional && typeof value === 'undefined'))) {
            return <SelectInput label={alias ?? key}
                value={value}
                inputHandler={inputHandler}
                options={field.enumOptions}
                optional={optional}
                descriptions={optionDescriptions}
            />
        }
    }

    if (showUnsupported) {
        return (
            <div key={key}>
                <div>
                    <span>{key}: </span>
                    <b>{describeUnknown(value)}</b>
                </div>
                <div>
                    {type ? 'INVALID FIELD TYPE' : 'UNSUPPORTED VALUE'}
                </div>
            </div>
        )
    }

    return null
}