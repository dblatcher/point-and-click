import type { SelectChangeEvent } from '@mui/material';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { FunctionComponent } from 'react';
import type { FieldProps } from './types';

const EMPTY_STRING = '';

export const SelectInput: FunctionComponent<
    FieldProps & {
        value: string | undefined;
        optional?: boolean;
        inputHandler: { (value: string | undefined): void };
        options: string[];
        descriptions?: string[];
    }
> = (props) => {
    const { value, optional, options, inputHandler, label, descriptions } = props;
    const handleChange = (event: SelectChangeEvent<string>) => {
        if (event.target.value === EMPTY_STRING) {
            return inputHandler(undefined);
        }
        return inputHandler(event.target.value);
    };
    const valueAsString = value ?? EMPTY_STRING;

    return (
        <FormControl fullWidth={!props.notFullWidth}>
            {label && (
                <InputLabel id={`select-input-label-${label}-${options.toString()}`}>
                    {label}
                </InputLabel>
            )}
            <Select
                size='small'
                variant='standard'
                required={!optional}
                value={valueAsString} label={label} onChange={handleChange}>
                {optional && <MenuItem value={EMPTY_STRING}>[none]</MenuItem>}
                {options.map((option, index) => (
                    <MenuItem key={option} value={option}>
                        {descriptions?.[index] ?? option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};