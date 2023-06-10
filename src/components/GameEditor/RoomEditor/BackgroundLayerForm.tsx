import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { BackgroundLayer } from "@/definitions";
import { listIds } from "@/lib/util";
import { ImageAsset } from "@/services/imageService";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Stack } from "@mui/material";
import { useState } from "react";

interface Props {
    imageAssets: Readonly<ImageAsset>[];
    addNewLayer: { (backgroundLayer: BackgroundLayer): void };
}



export function BackgroundLayerForm({ imageAssets, addNewLayer }: Props) {

    const [imageId, setImageId] = useState<string | undefined>(undefined);
    const [parallax, setParallax] = useState<number>(0);

    return (
        <Stack direction="row" spacing={2} flex={1} alignSelf={'stretch'}>
            <SelectInput
                value={imageId}
                options={listIds(imageAssets)}
                inputHandler={setImageId}
                optional
            />

            <Box maxWidth={100}>
                <NumberInput value={parallax}
                    inputHandler={setParallax}
                    label="parallax"
                    max={2} min={0} step={.05}
                />
            </Box>

            <Button
                size="small"
                sx={{ flexShrink: 0 }}
                variant="contained"
                disabled={!imageId}
                onClick={() => {
                    if (!imageId) { return }
                    addNewLayer({ imageId, parallax })
                    setParallax(0)
                    setImageId('')
                }}
                startIcon={<AddIcon />}>add new</Button>
        </Stack>
    )
}