import { BackgroundLayer, RoomData } from "point-click-lib";
import { Stack } from "@mui/material";
import { ArrayControl } from "../../ArrayControl";
import { ColorInput } from "../../ColorInput";
import { BackgroundLayerControl } from "./BackgroundLayerControl";
import { BackgroundLayerForm } from "./BackgroundLayerForm";
import { useGameDesign } from "@/context/game-design-context";
import { cloneData } from "@/lib/clone";
import { useAssets } from "@/context/asset-context";

interface Props {
    room: RoomData
}


export const BackgroundControl = ({ room }: Props) => {
    const { modifyRoom } = useGameDesign()
    const { imageAssets } = useAssets()
    const updateRoom = (mod: Partial<RoomData>, description?: string) => {
        const base = `change background, room ${room.id}`;
        modifyRoom(description ? `${base}: ${description}` : base, room.id, mod)
    }

    const backgroundImageAssets = imageAssets.filter(image => ['background', 'any'].includes(image.category))

    const changeBackgroundLayer = (index: number, mod: Partial<BackgroundLayer>, description?: string) => {
        const background = cloneData(room.background)
        const layer = background[index];
        if (!layer) {
            return
        }
        background[index] = { ...layer, ...mod };
        updateRoom({ background }, description)
    }
    const addBackground = (newLayer: BackgroundLayer) => {
        const { background } = room
        updateRoom({ background: [...background, newLayer] }, `add layer`)
    }

    return (
        <Stack spacing={0} justifyContent={'flex-start'}>
            <ColorInput label="backdrop color"
                value={room.backgroundColor ?? '#ffffff'}
                setValue={backgroundColor => updateRoom({ backgroundColor }, `set background color to ${backgroundColor}`)}
            />
            <ArrayControl
                stackProps={{ sx: {} }}
                list={room.background}
                buttonSize='large'
                horizontalMoveButtons
                mutateList={(background) => { updateRoom({ background }) }}
                describeItem={(layer, index) => (
                    <BackgroundLayerControl index={index}
                        roomData={room}
                        imageAssets={backgroundImageAssets}
                        layer={layer}
                        change={changeBackgroundLayer} />
                )}
            />
            <BackgroundLayerForm
                roomData={room}
                imageAssets={backgroundImageAssets}
                addNewLayer={addBackground} />
        </Stack>
    )
}