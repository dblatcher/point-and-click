import { StringInput } from "@/components/SchemaForm/StringInput";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { z } from "zod";
import { RangeInput } from "../RangeInput";
import { cloneData } from "@/lib/clone";

interface Props {
    value?: string
    setValue: { (value: string): void }
}

const filterProperty = z.enum([
    'blur',
    'brightness',
    'contrast',
    'drop-shadow',
    'grayscale',
    'hue-rotate',
    'invert',
    'opacity',
    'sepia',
    'saturate',
])
type FilterProperty = z.infer<typeof filterProperty>


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

type TokenValue = {
    numberValue?: number;
    unit?: string;
    shadow?: string;
}

type FilterToken = {
    property: FilterProperty,
    tokenValue: TokenValue
}

const parseToken = (token: string): FilterToken[] => {
    const bracketIndex = token.indexOf("(")
    const propertyParseResult = filterProperty.safeParse(token.substring(0, bracketIndex).trim())
    if (!propertyParseResult.success) {
        return []
    }
    const property = propertyParseResult.data
    const valueInBrackets = token.substring(bracketIndex)
    const valueString = valueInBrackets.substring(1, valueInBrackets.length - 1)
    const tokenValue = evaluate(property, valueString)
    if (!tokenValue) {
        return []
    }

    return [{ property, tokenValue }]
}

const evaluate = (property: FilterProperty, valueString: string): TokenValue | undefined => {

    if (property === 'drop-shadow') {
        return { numberValue: undefined, unit: undefined, shadow: valueString }
    }

    const letterIndex = valueString.search(/[a-z]/g)
    const numberValue = letterIndex === -1 ? Number(valueString) : Number(valueString.substring(0, letterIndex))
    const unit = letterIndex === -1 ? '' : valueString.substring(letterIndex)

    if (isNaN(numberValue)) {
        return undefined
    }
    return { numberValue, unit, shadow: undefined }
}


const tokenPattern = /[\a-z-]+\s?[\(]{1}[^\(]*[\)]{1}/g

const stringToFilterTokens = (value: string) => {
    const matches = [...value.trim().toLowerCase().matchAll(tokenPattern)].map(m => m[0])
    return matches.flatMap(parseToken)
}

const filterTokensToString = (tokens: FilterToken[]): string => {
    return tokens.map(token => {
        return token.property === 'drop-shadow'
            ? `${token.property}(${token.tokenValue.shadow})`
            : `${token.property}(${token.tokenValue.numberValue}${token.tokenValue.unit})`
    }).join(" ")
}

export const FilterControl: React.FunctionComponent<Props> = ({ value, setValue }) => {
    const [tokens, setTokens] = useState(stringToFilterTokens(value ?? ''))

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
                if (token) {
                    token.tokenValue.numberValue = Number(value);
                    const tokensCopyWithoutOtherTokensOfThisProperty = tokensCopy.filter(t => t === token || t.property !== property)
                    setTokens(tokensCopyWithoutOtherTokensOfThisProperty)
                    setValue(filterTokensToString(tokensCopyWithoutOtherTokensOfThisProperty))
                } else {
                    tokensCopy.push({ property: property, tokenValue: { numberValue: Number(value), unit } })
                    setTokens(tokensCopy)
                    setValue(filterTokensToString(tokensCopy))
                }
            }}
        />
    }


    return <Box>
        <Box sx={{
            maxWidth: 380
        }}>
            {Object.keys(propertyConfig).map(property =>
                <PropertyRange
                    key={property}
                    property={property as keyof typeof propertyConfig}
                />
            )}
        </Box>

        <StringInput
            label="filter" value={value ?? ''}
            inputHandler={(newValue) => {
                setTokens(stringToFilterTokens(newValue))
                setValue(newValue)
            }} />
    </Box>
}