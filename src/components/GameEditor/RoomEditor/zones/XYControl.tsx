
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { Box, IconButton } from "@mui/material";
import { ClickPointIcon } from "../../material-icons";

interface XY {
    x: number;
    y: number;
}

interface Props {
    shape: XY;
    index: number;
    changePosition: { (index: number, mod: Partial<XY>): void }
    handlePositionSelectButton: { (): void }
}

export const XYControl = ({ shape, index, changePosition, handlePositionSelectButton }: Props) => {
    const { x, y, } = shape
    return (
        <Box component={'section'} display={'flex'} flexWrap={'wrap'} paddingTop={2} gap={4}>
            <IconButton aria-label="select position"
                onClick={handlePositionSelectButton}
            >
                <ClickPointIcon fontSize="large" />
            </IconButton>
            <Box maxWidth={50}>
                <NumberInput notFullWidth label="X" value={x} inputHandler={x => changePosition(index, { x })} />
            </Box>
            <Box maxWidth={50}>
                <NumberInput notFullWidth label="Y" value={y} inputHandler={y => changePosition(index, { y })} />
            </Box>
        </Box>
    )
}