import { BackgroundLayer, RoomData } from "@/definitions";
import { Stack } from "@mui/material";
import { ArrayControl } from "../../ArrayControl";
import { ColorInput } from "../../ColorInput";
import { BackgroundLayerControl } from "./BackgroundLayerControl";
import { BackgroundLayerForm } from "./BackgroundLayerForm";
import { useGameDesign } from "@/context/game-design-context";
import { cloneData } from "@/lib/clone";
import { useImageAssets } from "@/context/image-asset-context";

interface Props {
    room: RoomData
}


export const BackgroundControl = ({ room }: Props) => {
    const { modifyRoom } = useGameDesign()
    const { getAllAssets} = useImageAssets()
    const updateRoom = (mod: Partial<RoomData>) => {
        modifyRoom(`change background, room ${room.id}`, room.id, mod)
    }

    const imageAssets = getAllAssets().filter(image => ['background', 'any'].includes(image.category))

    const changeBackground = (index: number, propery: keyof BackgroundLayer, newValue: string | number) => {
        const background = cloneData(room.background)
        const layer = background[index]
        switch (propery) {
            case 'parallax':
                if (typeof newValue === 'number') {
                    layer[propery] = newValue
                }
                break;
            case 'imageId':
                if (typeof newValue === 'string') {
                    layer[propery] = newValue
                }
                break;
        }
        updateRoom({ background })
    }
    const addBackground = (newLayer: BackgroundLayer) => {
        const { background } = room
        updateRoom({ background: [...background, newLayer] })
    }

    return (
        <Stack spacing={0}>
            <ColorInput label="backdrop color"
                value={room.backgroundColor ?? '#ffffff'}
                setValue={backgroundColor => updateRoom({ backgroundColor })}
            />
            <ArrayControl
                stackProps={{
                    maxWidth: 500,
                    sx: {},
                }}
                list={room.background}
                buttonSize='large'
                horizontalMoveButtons
                mutateList={(background) => { updateRoom({ background }) }}
                describeItem={(layer, index) => (
                    <BackgroundLayerControl index={index}
                        imageAssets={imageAssets}
                        layer={layer}
                        change={changeBackground} />
                )}
            />
            <BackgroundLayerForm
                imageAssets={imageAssets}
                addNewLayer={addBackground} />
        </Stack>
    )
}