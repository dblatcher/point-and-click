import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { useAssets } from "@/context/asset-context";
import { FileAsset, ImageAsset } from "@/services/assets";
import { Box, Button, Stack, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { ContextFileAssetSelector } from "../ContextFileAssetSelector";
import { EditorBox } from "../EditorBox";
import { FramePreview } from "./FramePreview";

interface Props {
    row: number;
    col: number;
    imageId?: string;
    pickFrame: { (row: number, col: number, imageId?: string): void };
    fixedSheet?: boolean;
    noOptions?: boolean;
    forDialog?: boolean;
    imageFilter?: { (item: FileAsset): boolean }
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
    const { widthScale = 1, heightScale = 1, id: imageId } = image

    return (
        <Button
            size="small"
            onClick={onClick} variant={isSelected ? 'contained' : 'outlined'}
        >
            <FramePreview
                height={frameSize * widthScale}
                width={frameSize * heightScale}
                frame={{ row, col, imageId }} />
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

const FramePickerInner: FunctionComponent<Props> = ({ row, col, imageId, pickFrame, fixedSheet = false, noOptions = false, imageFilter }) => {
    const { getAsset } = useAssets()
    const [showInOneRow, setShowInOneRow] = useState(false)
    const [buttonSize, setButtonSize] = useState<ButtonSize>('medium')
    const image = imageId ? getAsset(imageId) : undefined;
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
                        onClick: () => { pickFrame(r, c, imageId) }
                    }
                )
            }
        }
    }

    return (
        <>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-end'}>
                {!fixedSheet && (
                    <ContextFileAssetSelector assetType="image"
                        legend="sprite sheet"
                        format="select"
                        selectedItemId={imageId}
                        filterItems={imageFilter}
                        select={(item): void => { pickFrame(0, 0, item.id) }} />
                )}
                <Typography variant='h6'>
                    {imageId ?? '[no sheet]'} [ <span>{col}</span>,<span>{row}</span> ]
                </Typography>
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

            {!noOptions && (
                <Stack direction={'row'} justifyContent={'space-between'} paddingTop={2}>
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
            )}
        </>
    )
}

export const FramePicker: FunctionComponent<Props> = ({ forDialog, ...props }) => {
    if (forDialog) {
        return <FramePickerInner {...props} />
    }

    return (
        <EditorBox title="Pick frame">
            <FramePickerInner {...props} />
        </EditorBox>
    )
}
