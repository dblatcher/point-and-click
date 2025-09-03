import { AddIcon } from "@/components/GameEditor/material-icons";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { BackgroundLayer, RoomData } from "@/definitions";
import { listIds } from "@/lib/util";
import { ImageAsset } from "@/services/assets";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
import { BackDrop } from "./Backdrop";
import { BackgroundLayerControl } from "./BackgroundLayerControl";

interface Props {
    imageAssets: Readonly<ImageAsset>[];
    addNewLayer: { (backgroundLayer: BackgroundLayer): void };
    roomData: RoomData
}


export function BackgroundLayerForm({ imageAssets, addNewLayer, roomData }: Props) {

    const [newLayer, setNewLayer] = useState<BackgroundLayer>({
        imageId: '',
        parallax: 0,
    })

    const addLayerAndClearForm = () => {
        if (!newLayer.imageId) { return }
        addNewLayer(newLayer)
        setNewLayer({
            imageId: '',
            parallax: 0,
        })
    }


    return (
        <Box display={'flex'} flex={1} alignItems={'center'}>
            <Box width={47} />
            <BackgroundLayerControl
                layer={newLayer}
                roomData={roomData}
                imageAssets={imageAssets}
                index={-1}
                change={(_index, mod) => {
                    setNewLayer({ ...newLayer, ...mod })
                }}
            />
            <IconButton
                size="large"
                color="primary"
                sx={{ flexShrink: 0 }}
                disabled={!newLayer.imageId}
                onClick={addLayerAndClearForm}
            ><AddIcon fontSize="large" /></IconButton>
        </Box>
    )
}