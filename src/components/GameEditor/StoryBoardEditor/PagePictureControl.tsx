import { PagePicture, xPlacement, yPlacement } from "@/definitions/StoryBoard";
import { Box, Button, Stack } from "@mui/material";
import { FramePickDialogButton } from "../FramePickDialogButton";
import { FramePreview } from "../SpriteEditor/FramePreview";
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { AspectRatio } from "@/definitions/BaseTypes";

const AspectRatioControl = ({ value, setValue }: {
    value: AspectRatio | undefined,
    setValue: { (value: AspectRatio | undefined,): void }
}) => {

    const standard: AspectRatio = { x: 1, y: 1 };

    return <Box display='flex' gap={1}>
        {!value ? (
            <Button variant="outlined" onClick={() => { setValue(standard) }}>set aspect</Button>
        ) : (
            <>
                <Button variant="outlined" onClick={() => { setValue(undefined) }}>unset aspect</Button>
                <Stack>
                    <NumberInput label="x" value={value.x} step={1} min={1} notFullWidth
                        inputHandler={
                            (x) => { setValue({ ...value, x }) }
                        } />
                    <NumberInput label="y" value={value.y} step={1} min={1} notFullWidth
                        inputHandler={
                            (y) => { setValue({ ...value, y }) }
                        } />
                </Stack>
            </>
        )}
    </Box>
}

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
        if (!imageId) { return }
        updatePicture({
            image: { row, col, imageId }
        }, pictureIndex)
    }


    return <Box padding={2} display={'flex'}>
        <FramePreview frame={{ imageId, row, col }} width={50} height={50} />
        <FramePickDialogButton pickFrame={pickFrame} buttonLabel={'change image'} />
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
        </Stack>
        <Stack>
            <NumberInput label="width" value={picture.width ?? 0} inputHandler={(width) => updatePicture({ width }, pictureIndex)} />
            <NumberInput label="height" value={picture.height ?? 0} inputHandler={(height) => updatePicture({ height }, pictureIndex)} />
        </Stack>
        <AspectRatioControl value={picture.aspectRatio} setValue={(aspectRatio) => { updatePicture({ aspectRatio }, pictureIndex) }} />
    </Box>
}
