import { FunctionComponent } from "react";
import type { FieldProps } from './types';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";


const stringifyValue = (value: boolean | undefined): TristateValue => {
    switch (value) {
        case true:
            return 'true'
        case false:
            return 'false'
        case undefined:
            return 'undefined'
    }
}

const stringToValue = (stringValue: TristateValue) => {
    switch (stringValue) {
        case 'true':
            return true
        case 'false':
            return false
        case 'undefined':
        default:
            return undefined
    }
}


type TristateValue = 'true' | 'false' | 'undefined';
const tristateValues: TristateValue[] = ['true', 'false', 'undefined']

type LabelMap = {
    true: string;
    false: string;
    undefined: string;
}

export const TriStateInput: FunctionComponent<FieldProps & {
    name?: string;
    value: boolean | undefined;
    inputHandler: { (value: boolean | undefined): void };
    labelMap?: LabelMap
}> = ({ value, label, name, inputHandler, labelMap, notFullWidth }) => {

    const stringValue = stringifyValue(value)
    const groupName = `${name ?? label}-group`

    return <FormControl sx={{
        width: notFullWidth ? undefined : '100%',
        paddingRight: notFullWidth ? undefined : 3,
        boxSizing: 'border-box',
    }}>
        <FormLabel>{label}</FormLabel>
        <RadioGroup
            aria-label={name ?? label}
            value={stringValue}
            name={groupName}
            onChange={(event) =>
                inputHandler(stringToValue(event.target.value as TristateValue))
            }
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 5,
            }}
        >
            {tristateValues.map((label) =>
                <FormControlLabel key={label}
                    value={label}
                    control={<Radio size="small" sx={{ padding: 1}} />}
                    label={labelMap ? labelMap[label] : label} />
            )}
        </RadioGroup>
    </FormControl>
}
