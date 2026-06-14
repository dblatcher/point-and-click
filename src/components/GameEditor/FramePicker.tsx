import { BooleanInput } from "@/components/SchemaForm/BooleanInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { useAssets } from "@/context/asset-context";
import { SpriteFrame } from "point-click-lib";
import { FileAsset, ImageAsset } from "@/services/assets";
import { Box, Button, Card, Stack } from "@mui/material";
import { FunctionComponent, useCallback, useState } from "react";
import { FileAssetSelector } from "./FileAssetSelector";
import { FramePreview } from "./FramePreview";

interface Props {
    currentRow?: number;
    currentCol?: number;
    imageId?: string;
    setLocalFrame: { (row: number, col: number, imageId?: string): void };
    noOptions?: boolean;
    imageFilter?: { (item: FileAsset): boolean }
    handleSelection: { (frame: SpriteFrame): void };
}

interface FrameButtonProps {
    image: ImageAsset;
    row: number;
    col: number;
    onClick: { (): void }
    isSelected: boolean
    frameSize: number
    onPointer: { (row: number, col: number, enter: boolean): void }
}
const FrameButton = ({ image, row, col, onClick, isSelected, frameSize, onPointer }: FrameButtonProps) => {
    const { widthScale = 1, heightScale = 1, id: imageId } = image

    return (
        <Button
            size="small"
            sx={{ padding: 0 }}
            onClick={onClick}
            onPointerLeave={() => onPointer(row, col, false)}
            onPointerEnter={() => onPointer(row, col, true)}
            variant={isSelected ? 'contained' : 'outlined'}
            title={`[${col}, ${row}]`}
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

const MAGNIFIED_PREVIEW_SIZE = 150

export const FramePicker: FunctionComponent<Props> = ({
    currentRow,
    currentCol,
    imageId,
    setLocalFrame,
    noOptions = false,
    imageFilter,
    handleSelection,
}) => {
    const { getImageAsset } = useAssets()
    const [showInOneRow, setShowInOneRow] = useState(false)
    const [buttonSize, setButtonSize] = useState<ButtonSize>('medium')
    const [hoveredFrame, setHoveredFrame] = useState<{ row: number, col: number }>()
    const image = imageId ? getImageAsset(imageId) : undefined;
    const frameSize = frameSizeFromButtonSize(buttonSize)
    const { widthScale = 1, heightScale = 1 } = image ?? {};

    const onPointer = useCallback((row: number, col: number, enter: boolean) => {
        if (enter) {
            setHoveredFrame({ row, col })
        } else {
            setHoveredFrame(previous =>
                previous?.col === col && previous.row === row ? undefined : previous
            )
        }
    }, [])


    const buttonPropsGrid: FrameButtonProps[][] = []
    if (image) {
        for (let r = 0; r < (image.rows || 1); r++) {
            buttonPropsGrid[r] = [];
            for (let c = 0; c < (image.cols || 1); c++) {
                buttonPropsGrid[r].push(
                    {
                        isSelected: r === currentRow && c === currentCol,
                        row: r,
                        col: c,
                        image,
                        frameSize,
                        onClick: () => handleSelection({ row: r, col: c, imageId: image.id }),
                        onPointer
                    }
                )
            }
        }
    }

    return (
        <Stack>
            <Box alignSelf={'flex-start'}>
                <FileAssetSelector assetType="image"
                    legend="sprite sheet"
                    format="select"
                    selectedItemId={imageId}
                    filterItems={imageFilter}
                    select={(item): void => { setLocalFrame(0, 0, item.id) }} />
            </Box>

            <Box display={'flex'} justifyContent={'space-between'} gap={2} >
                <Box sx={{
                    overflowY: 'auto',
                    maxHeight: 300
                }}>
                    {image && (<>
                        {showInOneRow
                            ? (<div>
                                {buttonPropsGrid.flat().map((buttonProps, buttonIndex) => (
                                    <FrameButton {...buttonProps} key={buttonIndex} />
                                ))}
                            </div>
                            )
                            : buttonPropsGrid.map((rowOfButtons, rowIndex) => (
                                <div key={rowIndex} style={{ marginBottom: 10 }}>
                                    {rowOfButtons.map((buttonProps, buttonIndex) => (
                                        <FrameButton {...buttonProps} key={buttonIndex} />
                                    ))}
                                </div>
                            ))}
                    </>)}
                </Box>
                <Box
                    minHeight={MAGNIFIED_PREVIEW_SIZE}
                    minWidth={MAGNIFIED_PREVIEW_SIZE}
                    component={Card}
                    alignSelf={'flex-end'}
                >
                    {(imageId && hoveredFrame) && (
                        <FramePreview
                            height={MAGNIFIED_PREVIEW_SIZE * widthScale}
                            width={MAGNIFIED_PREVIEW_SIZE * heightScale}
                            frame={{ ...hoveredFrame, imageId }} />
                    )}
                </Box>
            </Box>

            {!noOptions && (
                <Stack direction={'row'} justifyContent={'space-between'} paddingTop={2} gap={2}>
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
        </Stack>
    )
}
