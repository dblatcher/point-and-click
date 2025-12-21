import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { AspectRatio } from "point-click-lib";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { AspectRatioIcon, CheckBoxIcon, CheckBoxOutlineBlankIcon } from "./material-icons";

interface Props {
    value: AspectRatio | undefined,
    setValue: { (value: AspectRatio | undefined,): void }
}

export const AspectRatioControl = ({ value, setValue }: Props) => {
    const standard: AspectRatio = { x: 1, y: 1 };
    
    return <Box gap={1} border={1}>
        <Stack direction={'row'} alignItems={'center'} gap={2} >
            <AspectRatioIcon fontSize="small" />
            <Typography variant='caption'>aspect ratio</Typography>
        </Stack>
        <Stack direction={'row'} alignItems={'center'} gap={2} >
            <Box maxWidth={30}>
                <NumberInput readOnly={!value} value={value?.x ?? 0} step={1} min={1}
                    inputHandler={
                        (x) => { if (value) { setValue({ ...value, x }) } }
                    } />
            </Box>
            <Typography fontWeight={700}>:</Typography>
            <Box maxWidth={30}>
                <NumberInput readOnly={!value} value={value?.y ?? 0} step={1} min={1} notFullWidth
                    inputHandler={
                        (y) => { if (value) { setValue({ ...value, y }) } }
                    } />
            </Box>
            {!value ? (
                <IconButton onClick={() => { setValue(standard) }}><CheckBoxOutlineBlankIcon /></IconButton>
            ) : (
                <IconButton onClick={() => { setValue(undefined) }}><CheckBoxIcon /></IconButton>
            )}
        </Stack>
    </Box>
}

