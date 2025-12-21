import { AddIcon } from "@/components/GameEditor/material-icons";
import { BackgroundLayer, RoomData } from "point-click-lib";
import { ImageAsset } from "@/services/assets";
import { Box, IconButton } from "@mui/material";
import { useState } from "react";
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
        <Box display={'flex'} alignItems={'center'}>
            <Box width={47} >
                <IconButton
                    size="large"
                    color="primary"
                    sx={{ flexShrink: 0 }}
                    disabled={!newLayer.imageId}
                    onClick={addLayerAndClearForm}
                ><AddIcon fontSize="large" /></IconButton>
            </Box>
            <BackgroundLayerControl
                layer={newLayer}
                roomData={roomData}
                imageAssets={imageAssets}
                index={-1}
                change={(_index, mod) => {
                    setNewLayer({ ...newLayer, ...mod })
                }}
            />
        </Box>
    )
}