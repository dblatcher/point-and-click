import { NumberInput, SelectInput, StringInput } from "@/components/SchemaForm/inputs";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { ActorData } from "@/definitions";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import { Alert, Box, Divider, Stack } from "@mui/material";
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

    const { sprite: spriteId, width = 1, height = 1 } = data

    return (
        <Box display={'flex'} gap={5} paddingTop={5}>
            <Stack spacing={2}>
                <SelectInput optional
                    value={spriteId}
                    options={listIds(sprites)}
                    label="pick sprite"
                    inputHandler={
                        id => updateFromPartial({ sprite: id })
                    }
                />

                <FramePickDialogButton 
                    buttonLabel="pick default frame"
                    title={`pick default image for ${data.id}`}
                    disabled={!!spriteId}
                    pickFrame={(row, col, imageId) => {
                        if (imageId) {
                            updateFromPartial({ defaultFrame: { row, col, imageId } })
                        } else {
                            updateFromPartial({ defaultFrame: undefined })
                        }
                    }}
                />

                <StringInput
                    label="filter" value={data.filter || ''}
                    inputHandler={(filter) => updateFromPartial({ filter })} />
                <NumberInput
                    label="display baseline" value={data.baseline || 0}
                    min={0} max={data.height}
                    inputHandler={(baseline) => updateFromPartial({ baseline })} />
            </Stack>

            <Divider flexItem orientation="vertical" />

            <Box minWidth={80 + width * 1.5}
                display={'flex'} flexDirection={'column'}
            >
                <Box display={'flex'} >
                    <Box flexBasis={80} flexShrink={0}></Box>
                    <Box flex={1} display={'flex'} justifyContent={'center'}>
                        <NumberInput label="width" value={width} notFullWidth
                            inputHandler={(width) => updateFromPartial({ width })} />
                    </Box>
                </Box>
                <Box display={'flex'} minHeight={height + 10} flex={1} >
                    <Box flexBasis={80} flexShrink={0} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
                        <NumberInput label="height" value={height} notFullWidth
                            inputHandler={(height) => updateFromPartial({ height })} />
                    </Box>
                    <Box flex={1} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
                        <SpritePreview data={data} maxHeight={height} />
                    </Box>
                </Box>
                {!data.sprite && !data.defaultFrame && (
                    <Alert severity="warning">
                        No Sprite or frame selected
                    </Alert>
                )}
            </Box>
        </Box>
    )
}
