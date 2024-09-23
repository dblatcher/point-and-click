import { StringInput } from "@/components/SchemaForm/StringInput";
import { cloneData } from "@/lib/clone";
import { Box } from "@mui/material";
import React from "react";
import { RangeInput } from "../GameEditor/RangeInput";
import { filterTokensToString, stringToFilterTokens } from "./util";

interface Props {
    value?: string
    setValue: { (value: string): void }
}



const propertyConfig = {
    'blur': { min: 0, max: 5, unit: 'px', step: 1, defaultValue: 0 },
    'brightness': { min: 0, max: 5, unit: '', step: .1, defaultValue: 1 },
    'contrast': { min: 0, max: 2, unit: '', step: .1, defaultValue: 1 },
    'grayscale': { min: 0, max: 1, unit: '', step: .1, defaultValue: 0 },
    'hue-rotate': { min: 0, max: 360, unit: 'deg', step: 1, defaultValue: 0 },
    'invert': { min: 0, max: 1, unit: '', step: .1, defaultValue: 0 },
    'opacity': { min: 0, max: 1, unit: '', step: .1, defaultValue: 1 },
    'sepia': { min: 0, max: 1, unit: '', step: .1, defaultValue: 0 },
    'saturate': { min: 0, max: 5, unit: '', step: .1, defaultValue: 1 },
}

const configKeys = Object.keys(propertyConfig) as (keyof typeof propertyConfig)[]

export const FilterControl: React.FunctionComponent<Props> = ({ value, setValue }) => {
    const tokens = stringToFilterTokens(value ?? '')

    const PropertyRange = (props: { property: keyof typeof propertyConfig }) => {
        const { property } = props
        const { unit, max, min, step, defaultValue } = propertyConfig[property]
        const value = tokens.find(t => t.property === property)?.tokenValue.numberValue ?? defaultValue
        return <RangeInput
            max={max}
            min={min}
            step={step}
            value={value}
            formattedValue={`${value}${unit}`}
            label={property}
            labelProps={{
                minWidth: 70
            }}
            onChange={(event) => {
                const { value } = event.target
                const tokensCopy = cloneData(tokens)
                const token = tokensCopy.find(t => t.property === property)
                if (Number(value) === defaultValue) {
                    setValue(filterTokensToString(tokensCopy.filter(t => t.property !== property)))
                } else if (token) {
                    token.tokenValue.numberValue = Number(value);
                    const tokensCopyWithoutOtherTokensOfThisProperty = tokensCopy.filter(t => t === token || t.property !== property)
                    // setTokens(tokensCopyWithoutOtherTokensOfThisProperty)
                    setValue(filterTokensToString(tokensCopyWithoutOtherTokensOfThisProperty))
                } else {
                    tokensCopy.push({ property: property, tokenValue: { numberValue: Number(value), unit } })
                    // setTokens(tokensCopy)
                    setValue(filterTokensToString(tokensCopy))
                }
            }}
        />
    }


    return <Box>
        <Box sx={{
            maxWidth: 380
        }}>
            {configKeys.map(property =>
                <PropertyRange
                    key={property}
                    property={property}
                />
            )}
        </Box>

        <StringInput
            label="filter" value={value ?? ''}
            inputHandler={(newValue) => {
                // setTokens(stringToFilterTokens(newValue))
                setValue(newValue)
            }} />
    </Box>
}