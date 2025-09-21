import { StringInput } from "@/components/SchemaForm/StringInput";
import { cloneData } from "@/lib/clone";
import { Box, Slider, Typography } from "@mui/material";
import React from "react";
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
        const renderValue = (value: number) => `${value} ${unit}`
        return <Box display={'flex'} alignItems={'center'} gap={4}>
            <Typography variant="caption" textAlign={'right'} minWidth={60}>{property}</Typography>
            <Slider
                size="small"
                max={max}
                min={min}
                step={step}
                value={value}
                sx={{
                    width: 100,
                }}
                valueLabelDisplay="auto"
                valueLabelFormat={renderValue}
                onChange={(_, rawValue) => {

                    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

                    const tokensCopy = cloneData(tokens)
                    const token = tokensCopy.find(t => t.property === property)
                    if (value === defaultValue) {
                        setValue(filterTokensToString(tokensCopy.filter(t => t.property !== property)))
                    } else if (token) {
                        token.tokenValue.numberValue = value;
                        const tokensCopyWithoutOtherTokensOfThisProperty = tokensCopy.filter(t => t === token || t.property !== property)
                        setValue(filterTokensToString(tokensCopyWithoutOtherTokensOfThisProperty))
                    } else {
                        tokensCopy.push({ property: property, tokenValue: { numberValue: value, unit } })
                        setValue(filterTokensToString(tokensCopy))
                    }
                }}
            />
            <Typography minWidth={100}>{renderValue(value)}</Typography>
        </Box>
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
                setValue(newValue)
            }} />
    </Box>
}