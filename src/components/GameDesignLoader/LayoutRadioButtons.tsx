import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { LayoutOption, layoutOptions, layouts } from "./layouts";


interface Props {
    layoutOption: LayoutOption
    setLayoutOption: { (layoutOption: LayoutOption): void }
}

export const LayoutRadioButtons: React.FunctionComponent<Props> = ({ layoutOption, setLayoutOption }: Props) => {

    const theme= useTheme()
    const mediumOrBelow = useMediaQuery(theme.breakpoints.down('md'));

    return <FormControl>
        <FormLabel id="layout-radio-buttons-group-label">Layout</FormLabel>
        <RadioGroup
            row = {mediumOrBelow}
            aria-labelledby="layout-radio-buttons-group-label"
            name="layout-radio-buttons-group"
            value={layoutOption}
            onChange={option => setLayoutOption(option.target.value as LayoutOption)}
        >
            {layoutOptions.map(option => (
                <FormControlLabel key={option}
                    value={option}
                    control={<Radio />}
                    label={layouts[option]?.title || option} />
            ))}
        </RadioGroup>
    </FormControl>
}