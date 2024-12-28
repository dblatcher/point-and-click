import { Autocomplete, Box, TextField, TextFieldProps, Typography } from '@mui/material';
import type { FormEventHandler, FunctionComponent, Ref } from 'react';
import { eventToString } from './util';
import { FieldProps } from './types';

export type StringInputProps = FieldProps & {
    value: string;
    inputHandler: { (value: string): void };
    type?: HTMLInputElement['type'];
    suggestions?: string[];
    inputRef?: Ref<any>;
}

export const StringInput: FunctionComponent<StringInputProps> = (props) => {
    const { type = 'text', suggestions, label, error, optional, readOnly, inputRef } = props;

    const sendValue: FormEventHandler<HTMLInputElement> = (event) => {
        props.inputHandler(eventToString(event));
    };

    const commonProps: Partial<TextFieldProps> = {
        fullWidth: !props.notFullWidth,
        label: label,
        type,
        helperText: error,
        error: !!error,
        required: !optional,
        disabled: readOnly,
        size: 'small',
        variant: type === 'textArea' ? 'outlined' : 'standard'
    }

    if (type === 'color') {
        return (
            <Box display='flex' alignItems='flex-end'>
                <TextField inputRef={inputRef}
                    value={props.value}
                    onInput={sendValue}
                    {...commonProps}
                    sx={{ maxWidth: 150, paddingRight: 1 }}
                />
                <Typography variant='caption'>{props.value}</Typography>
            </Box>
        )
    }

    if (suggestions) {
        return <Autocomplete ref={inputRef}
            fullWidth={!props.notFullWidth}
            disableClearable
            options={Array.from(new Set(suggestions))}
            freeSolo
            onInput={sendValue}
            onChange={(e) => {
                const value = e.currentTarget.textContent
                if (value) {
                    props.inputHandler(value);
                }
            }}
            value={props.value}
            renderInput={(params) => <TextField
                {...params}
                {...commonProps}
            />}
        />
    }

    return (
        <TextField inputRef={inputRef}
            multiline={type == 'textArea'}
            InputLabelProps={type == 'textArea' ? {
                shrink: true,
                sx: {
                    top: 2,
                    transform: 'none',
                    left: 10,
                }
            } : undefined}
            value={props.value}
            onInput={sendValue}
            {...commonProps}
        />
    );
};