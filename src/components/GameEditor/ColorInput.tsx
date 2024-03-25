import { Box, Typography } from "@mui/material";
import { ChangeEventHandler, useId, useState } from "react";

type Props = {
    label: string;
    value: string;
    setValue: { (value: string): void }
}


const colorRegex = /[#][0-9,a-f,A-F]{6}/
const isValidColor = (value: string): boolean => value.length === 7 && !!value.match(colorRegex)

const getShade = (value: string): number => {
    if (!isValidColor(value)) {
        return NaN;
    }
    const r = Number("0x" + value.substring(1, 2))
    const g = Number("0x" + value.substring(3, 4))
    const b = Number("0x" + value.substring(5, 6))
    return (r + g + b) / 3
}


export const ColorInput = ({ label, value, setValue }: Props) => {

    const inputId = useId()
    const [hasFocus, setHasFocus] = useState(false)

    const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
        const { value } = target
        setValue(value)
    }

    const valueIsValid = isValidColor(value);
    const colorToShow = valueIsValid ? value : '#ffffff'
    const colorText = valueIsValid ? value : '[invalid color]'
    const textColor = valueIsValid ? getShade(colorToShow) < 8 ? 'white' : 'black' : 'red'

    return (
        <Box position={'relative'} display={'inline'}>
            <input
                style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    opacity: 0,
                }}
                onFocus={() => setHasFocus(true)}
                onBlur={() => setHasFocus(false)}
                id={inputId}
                onChange={handleChange}
                type="color"
                value={colorToShow}
            />

            <Box component={'label'}
                htmlFor={inputId}
                display={'inline-flex'}
                alignItems='center'
                textAlign={'center'}
                gap={5}
                sx={{
                    cursor: 'pointer',
                    padding: 1,
                }}>
                <Typography >{label}</Typography>

                <Box sx={{
                    backgroundColor: colorText,
                    outlineColor: textColor,
                    outlineOffset: hasFocus ? -4 : -2,
                    outlineStyle: 'solid',
                    outlineWidth: hasFocus ? 2 : 1,
                    padding: 3,
                    minWidth: '4em',
                    borderRadius: 4,
                }}>
                    <Typography color={textColor} variant='button' fontWeight={'bold'}>{colorText}</Typography>
                </Box>
            </Box>
        </Box>
    )
}