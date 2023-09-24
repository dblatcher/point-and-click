import { FunctionComponent, useState } from "react";
import imageService, { ImageAsset } from "@/services/imageService";
import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { Box, Button, Typography, Stack } from "@mui/material";
import { EditorBox } from "../EditorBox";
import { ServiceItemSelector } from "../ServiceItemSelector";
import { SelectInput } from "@/components/SchemaForm/SelectInput";

interface Props {
    row: number;
    col: number;
    sheetId?: string;
    pickFrame: { (row: number, col: number, sheetId?: string): void };
    fixedSheet?: boolean;
}

interface FrameButtonProps {
    image: ImageAsset;
    row: number;
    col: number;
    onClick: { (): void }
    isSelected: boolean
    frameSize: number
}
const FrameButton = ({ image, row, col, onClick, isSelected, frameSize }: FrameButtonProps) => {
    const { href, cols = 1, rows = 1, widthScale = 1, heightScale = 1 } = image
    const imageStyle = {
        backgroundImage: `url(${href})`,
        backgroundPositionX: `${-100 * col}%`,
        backgroundPositionY: `${-100 * row}%`,
        backgroundSize: `${100 * cols}% ${100 * rows}%`,
        width: '100%',
        height: '100%',
        filter: undefined
    }

    return (
        <Button
            size="small"
            onClick={onClick} variant={isSelected ? 'contained' : 'outlined'}
        >
            <Box height={frameSize * widthScale} width={frameSize * heightScale}>
                <div style={imageStyle} />
            </Box>
        </Button >
    )
}

type ButtonSize = 'small' | 'medium' | 'large'

const frameSizeFromButtonSize = (buttonSize: ButtonSize): number => {
    switch (buttonSize) {
        case "small": return 30;
        case "medium": return 50;
        case "large": return 80;
        default: return 50
    }
}

export const FramePicker: FunctionComponent<Props> = ({ row, col, sheetId, pickFrame, fixedSheet = false }) => {
    const [showInOneRow, setShowInOneRow] = useState(false)
    const [buttonSize, setButtonSize] = useState<ButtonSize>('medium')
    const image = sheetId ? imageService.get(sheetId) : undefined;
    const frameSize = frameSizeFromButtonSize(buttonSize)

    const buttonPropsGrid: FrameButtonProps[][] = []
    if (image) {
        for (let r = 0; r < (image.rows || 1); r++) {
            buttonPropsGrid[r] = [];
            for (let c = 0; c < (image.cols || 1); c++) {
                buttonPropsGrid[r].push(
                    {
                        isSelected: r === row && c === col,
                        row: r,
                        col: c,
                        image,
                        frameSize,
                        onClick: () => { pickFrame(r, c, sheetId) }
                    }
                )
            }
        }
    }

    return (
        <EditorBox title="Pick frame">
            <Stack direction={'row'} justifyContent={'space-between'}>
                <BooleanInput value={showInOneRow} inputHandler={setShowInOneRow} label="arrange frames in one list" />
                <Box width={100}>
                    <SelectInput
                        label="button size"
                        value={buttonSize}
                        options={['small', 'medium', 'large']}
                        inputHandler={value => {
                            setButtonSize(value as ButtonSize)
                        }} />
                </Box>
            </Stack>

            {image && (<>
                {showInOneRow ? (<>
                    <div>
                        {buttonPropsGrid.flat().map((buttonProps, buttonIndex) => (
                            <FrameButton {...buttonProps} key={buttonIndex} />
                        ))}
                    </div>
                </>) : (<>
                    {
                        buttonPropsGrid.map((rowOfButtons, rowIndex) => (
                            <div key={rowIndex}>
                                {rowOfButtons.map((buttonProps, buttonIndex) => (
                                    <FrameButton {...buttonProps} key={buttonIndex} />
                                ))}
                            </div>
                        ))
                    }
                </>
                )}
            </>)}

            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-end'}>
                {!fixedSheet && (
                    <ServiceItemSelector legend="sprite sheet"
                        format="select"
                        service={imageService}
                        selectedItemId={sheetId}
                        select={(item): void => { pickFrame(0, 0, item.id) }} />
                )}
                <Typography variant='h6'>
                    {sheetId ?? '[no sheet]'} [ <span>{col}</span>,<span>{row}</span> ]
                </Typography>
            </Stack>
        </EditorBox>
    )
}