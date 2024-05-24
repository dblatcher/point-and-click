import { Box, Checkbox, TextField } from "@mui/material";
import { FormEventHandler, FunctionComponent, useState } from "react";
import { FieldProps } from "./types";
import { eventToString } from "./util";

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
        if (!checked) {
            return inputHandler(undefined)
        }
        props.inputHandler(storedText)
    }

    const isDefined = typeof props.value !== 'undefined'
    const labelText = isDefined ? label : `${label}(undefined)`

    return <Box>
        <TextField type={type}
            label={labelText}
            disabled={!isDefined}
            value={value ?? storedText}
            onInput={sendStringValue}
            size="small"
            variant={type === 'textArea' ? 'outlined' : 'standard'}
        />
        <Checkbox
            size='small'
            checked={isDefined}
            onChange={toggleUndefined}
        />
    </Box>
}
