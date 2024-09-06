export interface FieldDef {
    key: string;
    alias?: string;
    optional: boolean;
    type: string;
    value: unknown;
    enumOptions?: string[];
}
export type FieldValue = string | number | boolean | undefined;

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
};