import { ZodEnum } from 'zod';
import { SelectInput } from '../SchemaForm/SelectInput';
import { FieldProps } from '../SchemaForm/types';

type EnumSelectInputProps<T extends string> = FieldProps & {
    enumSchema: ZodEnum<[T, ...T[]]>;
    value: T | undefined;
    inputHandler: (value: T) => void;
    inputUndefinedHandler: () => void;
}

export const EnumSelectInput = <T extends string,>({
    enumSchema,
    value,
    inputHandler,
    inputUndefinedHandler,
    ...fieldProps
}: EnumSelectInputProps<T>) => {

    return (
        <SelectInput
            {...fieldProps}
            value={value}
            optional={!!inputUndefinedHandler}
            options={enumSchema.options}
            inputHandler={(newValue) => {
                if (inputUndefinedHandler && typeof newValue === 'undefined') {
                    return inputUndefinedHandler()
                }
                const parse = enumSchema.safeParse(newValue)
                if (parse.success) {
                    inputHandler(parse.data)
                }
            }}
        />
    );
};

