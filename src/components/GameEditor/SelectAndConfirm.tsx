import { SelectInput } from "@/components/SchemaForm/inputs";
import { Box, BoxProps, IconButton } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";

interface Props {
    label?: string
    inputHandler: { (item: string): void };
    options: string[];
    descriptions?: string[];
    boxProps?: BoxProps
}


export const SelectAndConfirm = ({ descriptions, options, inputHandler, label, boxProps = {} }: Props) => {

    const [value, setValue] = useState<string | undefined>(options[0])

    const handleConfirm = () => {
        if (!value) { return }
        inputHandler(value)
        setValue(undefined)
    }

    return (
        <Box {...boxProps}>
            <SelectInput
                label={label}
                options={options}
                descriptions={descriptions}
                value={value}
                inputHandler={(value) => { if (value) { setValue(value) } }}
            />
            <IconButton
                onClick={handleConfirm}
                aria-label="confirm"
                disabled={!value}
            >
                <AddIcon />
            </IconButton>
        </Box>
    )

}