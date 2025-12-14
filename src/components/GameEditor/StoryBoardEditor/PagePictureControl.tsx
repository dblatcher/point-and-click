import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { PagePicture } from "@/definitions/StoryBoard";
import { Box, Button, ButtonProps, Grid, Stack, Typography } from "@mui/material";
import { FramePickDialogButton } from "../FramePickDialogButton";
import { FramePreview } from "../FramePreview";
import { AspectRatioControl } from "../AspectRatioControl";
import { HideImageOutlinedIcon } from "../material-icons";


const PlacementControl = ({ x, y, updatePicture, pictureIndex }: Pick<PagePicture, 'x' | 'y'> & { updatePicture: { (mod: Partial<PagePicture>, pictureIndex: number): void }, pictureIndex: number }) => {

    const isCurrentPlace = (cellX: PagePicture['x'], cellY: PagePicture['y']) => cellX == x && cellY === y

    const buttonStyle: ButtonProps['sx'] = {
        borderRadius: 0,
        maxWidth: 30,
        minWidth: 30,
        minHeight: 30,
        maxHeight: 30,
    }

    const contents = (cellX: PagePicture['x'], cellY: PagePicture['y']) => isCurrentPlace(cellX, cellY)
        ? <Button sx={buttonStyle} size="small" variant="contained">*</Button>
        : <Button sx={buttonStyle} size="small" variant="outlined" onClick={() => updatePicture({ x: cellX, y: cellY }, pictureIndex)}></Button>

    return <Stack>
        <Stack direction={'row'}>
            {contents('left', 'top')}
            {contents('center', 'top')}
            {contents('right', 'top')}
        </Stack>
        <Stack direction={'row'}>
            {contents('left', 'center')}
            {contents('center', 'center')}
            {contents('right', 'center')}
        </Stack>
        <Stack direction={'row'}>
            {contents('left', 'bottom')}
            {contents('center', 'bottom')}
            {contents('right', 'bottom')}
        </Stack>
    </Stack>
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

    return <Box padding={2} display={'flex'} gap={2} alignItems={'center'}>
        <Box minWidth={60 * (4 / 12)}>
            <Grid container>
                <Grid item xs={4} display={'flex'} alignItems={'center'} >
                </Grid>
                <Grid item xs={8} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <Box width={60}>
                        <NumberInput notFullWidth label="width" value={picture.width ?? 0} inputHandler={(width) => updatePicture({ width }, pictureIndex)} />
                    </Box>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={4} display={'flex'} alignItems={'center'} >
                    <Box width={60}>
                        <NumberInput notFullWidth label="height" value={picture.height ?? 0} inputHandler={(height) => updatePicture({ height }, pictureIndex)} />
                    </Box>
                </Grid>
                <Grid item xs={8} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <FramePickDialogButton
                        pickFrame={pickFrame}
                        buttonLabel={'change image'}
                        buttonProps={{
                            variant: 'text',
                            sx: {
                                padding: 0,
                            }
                        }}
                        buttonContent={imageId
                            ? <FramePreview
                                style={{
                                    border: '1px solid black',
                                    alignSelf: 'center',
                                }}
                                aspectRatio={picture.aspectRatio}
                                frame={{ imageId, row, col }}
                                width={(picture.width ?? 5) * 4}
                                height={(picture.height ?? 5) * 4} />
                            : <HideImageOutlinedIcon sx={{
                                width: (picture.width ?? 5) * 4,
                                height: (picture.height ?? 5) * 4,
                            }} />
                        }
                    />
                </Grid>
            </Grid>
        </Box>
        <PlacementControl x={picture.x} y={picture.y} updatePicture={updatePicture} pictureIndex={pictureIndex} />
        <AspectRatioControl value={picture.aspectRatio} setValue={(aspectRatio) => { updatePicture({ aspectRatio }, pictureIndex) }} />
    </Box>
}
