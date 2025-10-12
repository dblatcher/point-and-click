export interface FieldDef {
    key: string;
    alias?: string;
    optional: boolean;
    type?: 'ZodString' | 'ZodBoolean' | 'ZodNumber' | 'ZodEnum';
    value: unknown;
    enumOptions?: string[];
}
export type FieldValue = string | number | boolean | undefined;

export const supportedTypes:FieldDef['type'][] = ['ZodString', 'ZodBoolean', 'ZodNumber', 'ZodEnum']

export type NumberInputSettings = {
    min?: number;
    max?: number;
    step?: number;
}

export type FieldProps = {
    label?: string;
    error?: string;
    optional?: boolean;
    readOnly?: boolean;
    notFullWidth?: boolean;
    minWidth?: number;
    maxWidth?: number;
};