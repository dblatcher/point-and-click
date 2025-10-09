import { SelectInput } from "@/components/SchemaForm/SelectInput"
import { Box } from "@mui/material"
import { Dispatch, ReactNode, SetStateAction } from "react"

interface Props {
    value: string | undefined,
    setValue: Dispatch<SetStateAction<string | undefined>>
    options: string[]
    descriptions?: ReactNode[]
}

export const TableFilter = ({ value, setValue, options, descriptions }: Props) => {
    return <Box minWidth={80}>
        <SelectInput
            optional
            inputHandler={setValue}
            value={value}
            options={options}
            descriptions={descriptions}
        />
    </Box>
}