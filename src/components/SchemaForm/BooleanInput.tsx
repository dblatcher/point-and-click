import { FormControlLabel, FormLabel, Stack, Switch } from '@mui/material';
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
            <FormControlLabel
                control={
                    <Switch
                        checked={props.value}
                        onChange={sendValue}
                        required={!props.optional}
                        disabled={props.readOnly}
                    />
                }
                label={props.value ? 'yes':'no'}
            />
        </Stack>
    );
};