import { PagePicture, xPlacement, yPlacement } from "@/definitions/StoryBoard";
import { Box, Stack } from "@mui/material";
import { FramePickDialogButton } from "../FramePickDialogButton";
import { FramePreview } from "../SpriteEditor/FramePreview";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { NumberInput } from "@/components/SchemaForm/NumberInput";


export const PagePictureControl = ({
    picture,
    pictureIndex,
    updatePicture,
}: {
    picture: PagePicture
    pictureIndex: number,
    updatePicture: { (mod: Partial<PagePicture>, pictureIndex: number): void }

}) => {
    const { imageId, row = 0, col = 0 } = picture.image ?? {};

    const pickFrame = (row: number, col: number, imageId?: string) => {
        if (!imageId) {
            updatePicture({
                image: undefined
            }, pictureIndex)
            return
        }
        updatePicture({
            image: { row, col, imageId }
        }, pictureIndex)
    }


    return <Box padding={2} display={'flex'}>
        <Stack>
            <SelectInput label="x"
                value={picture.x}
                options={xPlacement.options}
                inputHandler={(option) => {
                    const parsedOption = xPlacement.safeParse(option)
                    if (parsedOption.success) {
                        updatePicture({ x: parsedOption.data }, pictureIndex)
                    }
                }}
            />
            <SelectInput label="y"
                value={picture.y}
                options={yPlacement.options}
                inputHandler={(option) => {
                    const parsedOption = yPlacement.safeParse(option)
                    if (parsedOption.success) {
                        updatePicture({ y: parsedOption.data }, pictureIndex)
                    }
                }}
            />
            <NumberInput label="width" value={picture.width ?? 0} inputHandler={(width) => updatePicture({ width }, pictureIndex)} />
            <NumberInput label="height" value={picture.height ?? 0} inputHandler={(height) => updatePicture({ height }, pictureIndex)} />
        </Stack>
        <FramePickDialogButton pickFrame={pickFrame} buttonLabel={imageId ? 'change image' : 'add image'} />
        {!!imageId && (
            <FramePreview frame={{ imageId, row, col }} width={50} height={50} />
        )}
    </Box>
}
