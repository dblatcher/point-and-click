import { Checkbox, FormControlLabel, FormControlLabelProps } from '@mui/material';
import type { FunctionComponent } from 'react';
import type { FieldProps } from './types';

export const BooleanInput: FunctionComponent<
    FieldProps & {
        value?: boolean;
        inputHandler: { (value: boolean): void };
        sx?: FormControlLabelProps['sx']
    }
> = (props) => {


    return (
        <FormControlLabel
            sx={props.sx}
            label={props.label}
            control={
                <Checkbox
                    checked={props.value}
                    onChange={(_, value) => props.inputHandler(value)}
                    size="small" />
            } />
    )
};