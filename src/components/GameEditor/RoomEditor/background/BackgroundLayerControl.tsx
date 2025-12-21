import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { BackgroundLayer, RoomData } from "point-click-lib";
import { clamp, listIds } from "@/lib/util";
import { ImageAsset } from "@/services/assets";
import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";
import { WidthHeightControl } from "../../WidthHeightControl";
import { XYControl } from "../../XYControl";
import { BackDrop, BackDropFrame } from "./Backdrop";


interface Props {
    index: number;
    layer: BackgroundLayer;
    roomData: RoomData;
    imageAssets: Readonly<ImageAsset>[];
    change: { (index: number, mod: Partial<BackgroundLayer>, description?: string): void };
}


export const BackgroundLayerControl = ({ layer, index, imageAssets, change, roomData }: Props) => {
    const { parallax, imageId, placement } = layer
    const [savedPlacement, setSavedPlacement] = useState<BackgroundLayer['placement']>({
        x: (roomData.width / 2) - 25,
        y: (roomData.height / 2) - 25,
        width: 50,
        height: 50
    });

    const togglePlacement = () => {
        if (placement) {
            setSavedPlacement({ ...placement })
            change(index, { placement: undefined })
        } else {
            change(index, { placement: savedPlacement })
        }
    }

    return <Box display={'flex'} alignItems={'center'} gap={2} minHeight={80}>
        <Stack>
            <Box minWidth={150}>
                <SelectInput
                    value={imageId}
                    options={listIds(imageAssets)}
                    inputHandler={(imageId) => {
                        if (!imageId) { return }
                        change(index, { imageId }, `change image`)
                    }}
                />
            </Box>
            <Box display={'flex'} gap={2}>
                <NumberInput value={parallax} notFullWidth
                    inputHandler={(value) => {
                        change(index, { parallax: clamp(value, 2, 0) }, 'adjust parallax')
                    }}
                    label="parallax"
                    max={2} min={0} step={.05}
                />
                <Button
                    size="small"
                    sx={{ minWidth: 100 }}
                    onClick={togglePlacement}>{placement ? 'placed' : 'full size'}</Button>
            </Box>
        </Stack>

        <Box minWidth={120}>
            {placement && <>
                <XYControl point={placement} changePosition={(_, mod) => change(index, { placement: { ...placement, ...mod } })} />
                <WidthHeightControl shape={placement} changeShape={(mod) => change(index, { placement: { ...placement, ...mod } })} />
            </>}
        </Box>
        <BackDropFrame roomData={roomData} frameHeight={75} >
            <BackDrop layer={layer} roomData={roomData} />
        </BackDropFrame >
    </Box>
}
