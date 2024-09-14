import { NumberInput, SelectInput, StringInput } from "@/components/SchemaForm/inputs";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { ActorData } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import { Stack } from "@mui/material";
import { ColorInput } from "../ColorInput";
import { FramePickDialogButton } from "../FramePickDialogButton";
import { SpritePreview } from "../SpritePreview";

type Props = {
    data: ActorData;
}

export const ActorAppearanceControl = ({ data }: Props) => {
    const { performUpdate } = useGameDesign()
    const sprites = useSprites()

    const updateFromPartial = (modification: Partial<ActorData>): void => {
        performUpdate('actors', {
            ...cloneData(data),
            ...modification,
        })
    }

    const { sprite: spriteId, width = 1, height = 1, dialogueColor } = data


    return (

        <Stack direction={'row'} spacing={3}>
            <Stack spacing={2}>
                <SelectInput optional
                    value={spriteId}
                    options={listIds(sprites)}
                    label="pick sprite"
                    inputHandler={
                        id => updateFromPartial({ sprite: id })
                    }
                />

                <FramePickDialogButton title={`pick default image for ${data.id}`}
                    disabled={!!spriteId}
                    pickFrame={(row, col, imageId) => {
                        if (imageId) {
                            updateFromPartial({ defaultFrame: { row, col, imageId } })
                        } else {
                            updateFromPartial({ defaultFrame: undefined })
                        }
                    }}
                />

                <Stack direction={'row'} spacing={2}>
                    <NumberInput label="width" value={width}
                        inputHandler={(width) => updateFromPartial({ width })} />
                    <NumberInput label="height" value={height}
                        inputHandler={(height) => updateFromPartial({ height })} />
                </Stack>

                <StringInput
                    label="filter" value={data.filter || ''}
                    inputHandler={(filter) => updateFromPartial({ filter })} />
                <NumberInput
                    label="display baseline" value={data.baseline || 0}
                    min={0} max={data.height}
                    inputHandler={(baseline) => updateFromPartial({ baseline })} />
                <ColorInput
                    label="dialogue color"
                    value={dialogueColor || ''}
                    setValue={dialogueColor => {
                        updateFromPartial({ dialogueColor })
                    }} />
            </Stack>
            <SpritePreview data={data} />
        </Stack>

    )
}
