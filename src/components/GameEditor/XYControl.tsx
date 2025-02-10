
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { Box, IconButton } from "@mui/material";
import { ClickPointIcon, ClickPointActiveIcon } from "./material-icons";
import { ReactNode } from "react";
import { OptionalNumberInput } from "@/components/SchemaForm/OptionalNumberInput";

interface XY {
    x: number;
    y: number;
}

interface WalkToPoint {
    walkToX?: number;
    walkToY?: number;
}

type Props<T extends {}> = {
    point: T;
    index?: number;
    changePosition: { (index: number, mod: Partial<T>): void }
    handlePositionSelectButton?: { (): void }
    positionSelectIsActive?: boolean;
}


const Frame = (props: {
    children: ReactNode, handlePositionSelectButton?: { (): void }
    positionSelectIsActive?: boolean;
}) => {
    const { children, handlePositionSelectButton, positionSelectIsActive } = props
    return <Box component={'section'} display={'flex'} flexWrap={'wrap'} paddingTop={2} gap={4}>
        {!!handlePositionSelectButton && (
            <IconButton aria-label="select position"
                onClick={handlePositionSelectButton}
            >
                {positionSelectIsActive
                    ? <ClickPointActiveIcon fontSize="large" color={'primary'} />
                    : <ClickPointIcon fontSize="large" />
                }
            </IconButton>
        )}
        {children}
    </Box>
}

export const XYControl = ({ point, index = -1, changePosition, handlePositionSelectButton, positionSelectIsActive }: Props<XY>) => {
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

export const WalkToControl = ({ point, index = -1, changePosition, handlePositionSelectButton, positionSelectIsActive }: Props<WalkToPoint>) => {
    const { walkToX, walkToY } = point
    return (
        <Frame {...{ handlePositionSelectButton, positionSelectIsActive }}>
            <Box>
                <OptionalNumberInput
                    minWidth={100}
                    value={walkToX} label="walk-to X: "
                    inputHandler={walkToX => changePosition(index, { walkToX })} />
            </Box>
            <Box>
                <OptionalNumberInput
                    minWidth={100}
                    value={walkToY} label="walk-to Y: "
                    inputHandler={walkToY => changePosition(index, { walkToY })} />
            </Box>
        </Frame>
    )
}