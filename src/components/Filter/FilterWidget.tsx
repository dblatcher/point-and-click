import { Box, Button, ButtonGroup, Typography } from "@mui/material"
import React, { ReactNode, useState } from "react"
import { FilterControl } from "./FilterControl"

interface Props {
    value?: string
    setValue: { (value: string): void }
    renderPreview: { (filter: string): ReactNode }
}


export const FilterWidget: React.FunctionComponent<Props> = ({ value = '', setValue, renderPreview }) => {

    const [localValue, setLocalValue] = useState(value)

    return <Box>
        <Typography><b>Filter:</b> {value || "[none]"}</Typography>
        <ButtonGroup>
            <Button onClick={() => { setValue(localValue) }}>update</Button>
            <Button onClick={() => { setLocalValue('') }}>clear</Button>
            <Button onClick={() => { setLocalValue(value) }}>undo changes</Button>
        </ButtonGroup>

        <Box display={'flex'}>
            <FilterControl value={localValue} setValue={setLocalValue} key={value} />
            <Box display={'flex'} alignItems={'center'} flexDirection={'column'}>
                {renderPreview(localValue)}
                <Typography variant="caption">filter preview</Typography>
            </Box>
        </Box>
    </Box>
}