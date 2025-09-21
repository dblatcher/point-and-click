import { Slider, Stack, StackProps, Typography, TypographyProps } from "@mui/material";
import { ChangeEventHandler } from "react";


interface Props {
    label: string;
    value: number;
    max: number;
    min?: number;
    step?: number;
    disabled?: boolean;
    onChange: ChangeEventHandler<HTMLInputElement>;
    formattedValue?: string
    stackProps?: StackProps
    labelProps?: Omit<TypographyProps, 'ref'>
}


export const RangeInput = ({
    label, value, max, min = 0, step = 10, disabled, onChange, formattedValue = value.toString(), 
    stackProps, labelProps,
}: Props) => {
    return (
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} {...stackProps}>
            <Typography component={'label'} variant="body2" {...labelProps} >{label}</Typography>
            <input type='range' value={value}
                max={max} min={min} step={step}
                disabled={disabled}
                onChange={onChange} />
            <Typography component={'span'} variant="body2" sx={{ fontFamily: 'monospace' }} {...labelProps}>{formattedValue}</Typography>
        </Stack>
    )
}