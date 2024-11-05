import { NumberInput } from "@/components/SchemaForm/NumberInput";
import React from "react";

interface Props {
    value?: number
    setValue: { (value: number): void }
    disabled?: boolean;
}

export const VolumeControl: React.FunctionComponent<Props> = ({ value, setValue, disabled = false }) => {

    return <NumberInput
        label="volume"
        notFullWidth
        readOnly={disabled}
        value={typeof value === 'number' ? value : 1}
        max={1} min={0} step={.1}
        inputHandler={setValue}
    />
}