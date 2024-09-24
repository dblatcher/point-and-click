
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { Box, IconButton } from "@mui/material";
import { ClickPointIcon, ClickPointActiveIcon } from "../../material-icons";
import { ReactNode } from "react";
import { OptionalNumberInput } from "@/components/SchemaForm/OptionalNumberInput";

const Frame = (props: {
    children: ReactNode, handlePositionSelectButton: { (): void }
    positionSelectIsActive?: boolean;
}) => {
    const { children, handlePositionSelectButton, positionSelectIsActive } = props
    return <Box component={'section'} display={'flex'} flexWrap={'wrap'} paddingTop={2} gap={4}>
        <IconButton aria-label="select position"
            onClick={handlePositionSelectButton}
        >
            {positionSelectIsActive
                ? <ClickPointActiveIcon fontSize="large" color={'primary'} />
                : <ClickPointIcon fontSize="large" />
            }
        </IconButton>
        {children}
    </Box>
}

interface XY {
    x: number;
    y: number;
}

interface XYProps {
    point: XY;
    index: number;
    changePosition: { (index: number, mod: Partial<XY>): void }
    handlePositionSelectButton: { (): void }
    positionSelectIsActive?: boolean;
}

export const XYControl = ({ point, index, changePosition, handlePositionSelectButton, positionSelectIsActive }: XYProps) => {
    const { x, y, } = point
    return (
        <Frame {...{ handlePositionSelectButton, positionSelectIsActive }}>
            <Box maxWidth={50}>
                <NumberInput notFullWidth label="X" value={x} inputHandler={x => changePosition(index, { x })} />
            </Box>
            <Box maxWidth={50}>
                <NumberInput notFullWidth label="Y" value={y} inputHandler={y => changePosition(index, { y })} />
            </Box>
        </Frame>
    )
}

interface WalkToPoint {
    walkToX?: number;
    walkToY?: number;
}

interface WalkToProps {
    point: WalkToPoint;
    index: number;
    changePosition: { (index: number, mod: Partial<WalkToPoint>): void }
    handlePositionSelectButton: { (): void }
    positionSelectIsActive?: boolean;
}

export const WalkToControl = ({ point, index, changePosition, handlePositionSelectButton, positionSelectIsActive }: WalkToProps) => {
    const { walkToX, walkToY } = point
    return (
        <Frame {...{ handlePositionSelectButton, positionSelectIsActive }}>
            <Box>
                <OptionalNumberInput
                    value={walkToX} label="walk-to X: "
                    inputHandler={walkToX => changePosition(index, { walkToX })} />
            </Box>
            <Box>
                <OptionalNumberInput
                    value={walkToY} label="walk-to Y: "
                    inputHandler={walkToY => changePosition(index, { walkToY })} />
            </Box>
        </Frame>
    )
}