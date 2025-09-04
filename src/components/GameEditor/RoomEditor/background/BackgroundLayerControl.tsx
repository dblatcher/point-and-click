import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { BackgroundLayer, RoomData } from "@/definitions";
import { clamp, listIds } from "@/lib/util";
import { ImageAsset } from "@/services/assets";
import { Box, Button } from "@mui/material";
import { BackDrop, BackDropFrame } from "./Backdrop";
import { XYControl } from "../../XYControl";
import { WidthHeightControl } from "../../WidthHeightControl";


interface Props {
    index: number;
    layer: BackgroundLayer;
    roomData: RoomData;
    imageAssets: Readonly<ImageAsset>[];
    change: { (index: number, mod: Partial<BackgroundLayer>, description?: string): void };
}


export function BackgroundLayerControl({ layer, index, imageAssets, change, roomData }: Props) {
    const { parallax, imageId, placement } = layer

    const togglePlacement = () => {
        if (placement) {
            change(index, { placement: undefined })
        } else {
            change(index, {
                placement: {
                    x: (roomData.width / 2) - 25,
                    y: (roomData.height / 2) - 25,
                    width: 50,
                    height: 50
                }
            })
        }
    }

    return <Box display={'flex'} alignItems={'center'} gap={2} minHeight={80}>
        <Box minWidth={200}>
            <SelectInput
                value={imageId}
                options={listIds(imageAssets)}
                inputHandler={(imageId) => {
                    if (!imageId) { return }
                    change(index, { imageId }, `change image`)
                }}
            />
        </Box>
        <Box maxWidth={100}>
            <NumberInput value={parallax}
                inputHandler={(value) => {
                    change(index, { parallax: clamp(value, 2, 0) }, 'adjust parallax')
                }}
                label="parallax"
                max={2} min={0} step={.05}
            />
            <Button sx={{ minWidth: 100 }} onClick={togglePlacement}>{placement ? 'placed' : 'full size'}</Button>
        </Box>
        <BackDropFrame roomData={roomData} frameHeight={60} >
            <BackDrop layer={layer} roomData={roomData} />
        </BackDropFrame >
        <Box minWidth={120}>
            {placement && <>
                <XYControl point={placement} changePosition={(_, mod) => change(index, { placement: { ...placement, ...mod } })} />
                <WidthHeightControl shape={placement} changeShape={(mod) => change(index, { placement: { ...placement, ...mod } })} />
            </>}
        </Box>
    </Box>
}
