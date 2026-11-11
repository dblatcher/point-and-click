export interface FieldDef {
    key: string;
    alias?: string;
    optional: boolean;
    type?: 'string' | 'boolean' | 'number' | 'enum';
    value: unknown;
    enumOptions?: string[];
}

export type SupportedData = Record<string, any>

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