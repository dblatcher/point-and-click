import { FunctionComponent, FormEventHandler, useState } from "react";
import { FieldProps } from "./types";
import { eventToString } from "./util";
import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material";

export const OptionalStringInput: FunctionComponent<FieldProps & {
    value: string | undefined;
    type?: string;
    inputHandler: { (value: string | undefined): void };
}> = (props) => {
    const { type = 'text', value, inputHandler, label } = props
    const [storedText, setStoredText] = useState(value ?? '')

    const sendStringValue: FormEventHandler<HTMLInputElement> = (event) => {
        const inputValue = eventToString(event)
        setStoredText(inputValue)
        inputHandler(inputValue)
    }

    const toggleUndefined: FormEventHandler<HTMLInputElement> = (event) => {
        const { checked } = event.nativeEvent.target as HTMLInputElement;
        if (checked) {
            return inputHandler(undefined)
        }
        props.inputHandler(storedText)
    }

    return <Box>

        <TextField type={type}
            label={label}
            disabled={typeof value === 'undefined'}
            value={value ?? storedText}
            onInput={sendStringValue}
            size="small"
            variant= {type === 'textArea' ? 'outlined' : 'standard'}
        />

        <FormControlLabel control={
            <Checkbox
                checked={typeof value === 'undefined'}
                onChange={toggleUndefined}
                size="small"
            />
        }
            label="undefined"
            labelPlacement="top"
            slotProps={{typography:{
                variant:'body2'
            }}}
        />
    </Box>
}
