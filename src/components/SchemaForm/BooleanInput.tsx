import { Checkbox, FormLabel, Stack } from '@mui/material';
import type { FormEventHandler, FunctionComponent } from 'react';
import type { FieldProps } from './types';
import { eventToBoolean } from './util';

export const BooleanInput: FunctionComponent<
    FieldProps & {
        value: boolean;
        inputHandler: { (value: boolean): void };
    }
> = (props) => {
    const sendValue: FormEventHandler<HTMLInputElement> = (event) => {
        props.inputHandler(eventToBoolean(event));
    };

    return (
        <Stack direction='row' alignItems={'center'} spacing={1}>
            <FormLabel>{props.label}</FormLabel>
            <Checkbox
                checked={props.value}
                required={!props.optional}
                disabled={props.readOnly}
                onChange={sendValue}
            />
        </Stack>
    );
};