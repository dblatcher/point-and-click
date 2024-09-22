import { z } from "zod"


export const filterProperty = z.enum([
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
export type FilterProperty = z.infer<typeof filterProperty>


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

export const stringToFilterTokens = (value: string) => {
    const matches = [...value.trim().toLowerCase().matchAll(tokenPattern)].map(m => m[0])
    return matches.flatMap(parseToken)
}

export const filterTokensToString = (tokens: FilterToken[]): string => {
    return tokens.map(token => {
        return token.property === 'drop-shadow'
            ? `${token.property}(${token.tokenValue.shadow})`
            : `${token.property}(${token.tokenValue.numberValue}${token.tokenValue.unit})`
    }).join(" ")
}