import { TextField } from '@mui/material';
import type { FormEventHandler, FunctionComponent } from 'react';
import type { FieldProps } from './types';
import { eventToNumber } from './util';

export const NumberInput: FunctionComponent<
    FieldProps & {
        value: number;
        inputHandler: { (value: number): void };
        max?: number;
        min?: number;
        /**Material UI TextFields do not support the 'step' attribute */
        step?: number;
    }
> = (props) => {
    const { max, min } = props;

    const sendValue: FormEventHandler<HTMLInputElement> = (event) => {
        const newValue = eventToNumber(event);
        if (typeof min === 'number' && newValue < min) {
            return;
        }
        if (typeof max === 'number' && newValue > max) {
            return;
        }
        props.inputHandler(eventToNumber(event));
    };

    return (
        <TextField
            fullWidth={!props.notFullWidth}
            size='small'
            variant='standard'
            label={props.label}
            type={'number'}
            value={props.value}
            onInput={sendValue}
            helperText={props.error}
            error={!!props.error}
            required={!props.optional}
            disabled={props.readOnly}
            inputProps={{
                step: props.step,
                max: props.max,
                min: props.min,
            }}
        />
    );
};