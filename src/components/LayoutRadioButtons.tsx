import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import React from "react";
import { LayoutOption, layoutOptions } from "./layouts";


interface Props {
    layoutOption: LayoutOption
    setLayoutOption: { (layoutOption: LayoutOption): void }
}

export const LayoutRadioButtons: React.FunctionComponent<Props> = ({ layoutOption, setLayoutOption }: Props) => {

    return <FormControl>
        <FormLabel id="layout-radio-buttons-group-label">Layout</FormLabel>
        <RadioGroup row
            aria-labelledby="layout-radio-buttons-group-label"
            defaultValue={layoutOptions[0]}
            name="layout-radio-buttons-group"
            value={layoutOption}
            onChange={option => setLayoutOption(option.target.value as LayoutOption)}
        >
            {layoutOptions.map(option => (
                <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
            ))}
        </RadioGroup>
    </FormControl>
}