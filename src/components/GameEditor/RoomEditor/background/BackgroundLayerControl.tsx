import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { BackgroundLayer, RoomData } from "@/definitions";
import { clamp, listIds } from "@/lib/util";
import { ImageAsset } from "@/services/assets";
import { Box } from "@mui/material";
import { BackDrop } from "./Backdrop";


interface Props {
    index: number;
    layer: BackgroundLayer;
    roomData: RoomData;
    imageAssets: Readonly<ImageAsset>[];
    change: { (index: number, mod: Partial<BackgroundLayer>, description?: string): void };
}


export function BackgroundLayerControl({ layer, index, imageAssets, change, roomData }: Props) {
    const { parallax, imageId, placement } = layer

    return <Box display={'flex'} alignItems={'center'} gap={2}>
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
        </Box>
        <BackDrop.frame roomData={roomData} frameHeight={60} >
            <BackDrop layer={layer} roomData={roomData} />
        </BackDrop.frame >
    </Box>
}
