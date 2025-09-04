import { Box } from "@mui/material"
import { NumberInput } from "../SchemaForm/NumberInput"

type Shape = { width: number, height: number };

type Props = {
    shape: Shape
    changeShape: {(mod:Partial<Shape>):void}
}

export const WidthHeightControl = ({ shape, changeShape }: Props) => {
    const { width, height } = shape
    return (
        <Box component={'section'} display={'flex'} flexWrap={'wrap'} paddingTop={2} gap={4}>
            <Box maxWidth={50}>
                <NumberInput notFullWidth label="width" value={width} inputHandler={width => changeShape({ width })} />
            </Box>
            <Box maxWidth={50}>
                <NumberInput notFullWidth label="height" value={height} inputHandler={height => changeShape({ height })} />
            </Box>
        </Box>
    )
}