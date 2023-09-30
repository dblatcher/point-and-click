import { ImageAsset } from "@/services/assets";
import { BackgroundLayer } from "@/definitions";
import { clamp, listIds } from "@/lib/util";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { Box, Stack } from "@mui/material";


interface Props {
    index: number;
    layer: BackgroundLayer;
    imageAssets: Readonly<ImageAsset>[];
    change: { (index: number, propery: keyof BackgroundLayer, newValue: string | number): void };
}

export function BackgroundLayerControl({ layer, index, imageAssets, change }: Props) {
    const { parallax, imageId } = layer

    return <Stack direction="row" spacing={2} flex={1}>
        <SelectInput
            value={imageId}
            options={listIds(imageAssets)}
            inputHandler={(value) => {
                if (!value) { return }
                change(index, 'imageId', value)
            }}
        />
        <Box maxWidth={100}>
            <NumberInput value={parallax}
                inputHandler={(value) => { change(index, 'parallax', clamp(value, 2, 0)) }}
                label="parallax"
                max={2} min={0} step={.05}
            />
        </Box>
    </Stack>
}
