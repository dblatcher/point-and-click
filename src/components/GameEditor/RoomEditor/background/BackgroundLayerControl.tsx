import { ImageAsset } from "@/services/assets";
import { BackgroundLayer } from "@/definitions";
import { clamp, listIds } from "@/lib/util";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { Box, Stack } from "@mui/material";
import { BackDrop } from "./Backdrop";


interface Props {
    index: number;
    layer: BackgroundLayer;
    imageAssets: Readonly<ImageAsset>[];
    change: { (index: number, mod: Partial<BackgroundLayer>, description?: string): void };
}

export function BackgroundLayerControl({ layer, index, imageAssets, change }: Props) {
    const { parallax, imageId } = layer

    return <Stack direction="row" spacing={2} flex={1} alignItems={'center'}>
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
        <Box position={'relative'} height={50} width={100} border={'1px solid'}>
            <BackDrop layer={layer} />
        </Box>
    </Stack>
}
