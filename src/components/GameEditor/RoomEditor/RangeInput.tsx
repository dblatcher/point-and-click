import { Stack, Typography } from "@mui/material";
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
}


export const RangeInput = ({ label, value, max, min = 0, step = 10, disabled, onChange, formattedValue = value.toString() }: Props) => {
    return (
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography component={'label'} variant="body2">{label}</Typography>
            <input type='range' value={value}
                max={max} min={min} step={step}
                disabled={disabled}
                onChange={onChange} />
            <Typography component={'span'} variant="body2" sx={{fontFamily:'monospace'}}>{formattedValue}</Typography>
        </Stack>
    )
}