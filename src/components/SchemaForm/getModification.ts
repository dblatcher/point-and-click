import { FieldDef, FieldValue } from "./types";

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