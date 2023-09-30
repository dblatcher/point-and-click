import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    Stack,
    Switch,
    TextField,
} from '@mui/material';
import type { FormEventHandler, FunctionComponent } from 'react';
import { useState } from 'react';
import type { FieldProps } from './types';
import { eventToNumber } from './util';

export const OptionalNumberInput: FunctionComponent<
    FieldProps & {
        value: number | undefined;
        inputHandler: { (value: number | undefined): void };
        max?: number;
        min?: number;
        step?: number;
    }
> = (props) => {
    const { value, label, min, max } = props;
    const [storedNumber, setStoredNumber] = useState(value ?? min ?? 0);

    const sendNumberValue: FormEventHandler<HTMLInputElement> = (event) => {
        const newValue = eventToNumber(event);
        if (typeof min === 'number' && newValue < min) {
            return;
        }
        if (typeof max === 'number' && newValue > max) {
            return;
        }
        setStoredNumber(newValue);
        props.inputHandler(eventToNumber(event));
    };

    const toggleUndefined: FormEventHandler<HTMLInputElement> = (event) => {
        const { checked } = event.target as HTMLInputElement;
        if (checked) {
            return props.inputHandler(undefined);
        }

        props.inputHandler(storedNumber);
    };

    return (
        <Stack direction='row' alignItems={'center'} spacing={1} minWidth={200}>
            <TextField
                label={label}
                size='small'
                variant='standard'
                type={'number'}
                value={props.value ?? storedNumber}
                onInput={sendNumberValue}
                helperText={props.error}
                error={!!props.error}
                required={false}
                disabled={typeof props.value === 'undefined' || props.readOnly}
                inputProps={{
                    step: props.step
                }}
                sx={{
                    maxWidth: 100
                }}
            />
            <FormGroup>
                <FormControlLabel
                    labelPlacement='top'
                    control={
                        <Checkbox
                            size='small'
                            checked={typeof props.value === 'undefined'}
                            onChange={toggleUndefined}
                        />
                    }
                    label={'undefined'}
                />
            </FormGroup>
        </Stack>
    );
};