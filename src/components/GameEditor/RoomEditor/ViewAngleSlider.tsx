import { Box, BoxProps, Slider, Typography } from "@mui/material";
import { CSSProperties } from "react";

interface Props {
    viewAngle: number;
    setViewAngle: { (value: number): void }
    forY?: boolean,
    trackLength?: CSSProperties['height']
    label?: string
    boxProps?: BoxProps
}

export const ViewAngleSlider = ({ viewAngle: viewAngle, setViewAngle, forY, trackLength = 200, label, boxProps }: Props) => {


    return (
        <Box display={'flex'} alignItems={'center'} {...boxProps}>
            {label &&
                <Typography component={'label'} variant="body2" marginRight={5}>{label}</Typography>
            }
            <Slider
                sx={{
                    width: forY ? undefined : trackLength,
                    height: forY ? trackLength : undefined,
                }}
                marks={[{ value: 0 }]}
                orientation={forY ? 'vertical' : 'horizontal'}
                valueLabelFormat={viewAngle => `${Math.sign(viewAngle) !== -1 ? '+' : '-'}${Math.abs(viewAngle).toFixed(2)}`}
                valueLabelDisplay="auto"
                track={false}
                max={1} min={-1} step={.01}
                value={viewAngle}
                onChange={(_event, value) => {
                    const newAngle = Array.isArray(value) ? value[0] : value
                    setViewAngle(newAngle)
                }} />
        </Box>
    )
}