import { FieldValue } from "@/components/SchemaForm";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { Room } from "@/components/svg/Room";
import { useGameDesign } from "@/context/game-design-context";
import { BackgroundLayer, RoomData } from "@/definitions";
import imageService from "@/services/imageService";
import { Alert, Box, Grid, Stack } from "@mui/material";
import { ReactNode, useState } from "react";
import { ViewAngleSlider } from "./ViewAngleSlider";

interface Props {
    room: RoomData
}

const RightGridCell = ({ children, row }: { children?: ReactNode, row?: boolean }) => <Grid
    item xs={11}
    padding={1}
    flexDirection={row ? 'row' : 'column'}
    display={'flex'}
    gap={2}
    justifyContent={row ? 'flex-start' : 'center'}
    alignItems={row ? 'center' : 'flex-start'}>
    {children}</Grid>
const LeftGridCell = ({ children }: { children?: ReactNode }) => <Grid
    item xs={1}
    padding={1}
    flexDirection={'column'}
    justifyContent={'center'}
    display={'flex'}>
    {children}</Grid>

const BackDrop = ({ layer }: { layer: BackgroundLayer }) => {
    const href = imageService.get(layer.imageId)?.href
    if (!href) {
        return null
    }
    return <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("${href}")`,
        backgroundSize: '100% 100%',
        filter: 'saturate(.15)',
    }}>
    </div>
}

export const DimensionControl = ({ room }: Props) => {
    const { performUpdate } = useGameDesign()
    const [scale, setScale] = useState(.75)
    const [viewAngle, setViewAngle] = useState(0)
    const updateRoom = (mod: Record<string, FieldValue>) => {
        performUpdate('rooms', { ...room, ...mod })
    }
    const frameCenter = (room.width * .5) - (room.frameWidth * .5)
    const viewBoxLeft = frameCenter - (viewAngle * frameCenter);

    return <Box>
        <Grid container>
            <LeftGridCell />
            <RightGridCell row>
                <Stack>
                    <Box>
                        <NumberInput label="width" value={room.width}
                            inputHandler={(width) => { updateRoom({ width }) }} />
                    </Box>
                    <Box display={'flex'} gap={2}>
                        <NumberInput label="frameWidth" value={room.frameWidth}
                            inputHandler={(frameWidth) => { updateRoom({ frameWidth }) }} />

                    </Box>
                </Stack>
                {room.frameWidth > room.width &&
                    <Alert severity="warning">visible frame is wider than room!</Alert>
                }
            </RightGridCell>
        </Grid>
        <Grid container>
            <LeftGridCell>
                <NumberInput label="height" value={room.height}
                    inputHandler={(height) => { updateRoom({ height }) }} />
            </LeftGridCell>
            <RightGridCell>
                <Box bgcolor={room.backgroundColor ?? 'white'} width={room.width * scale} height={room.height * scale} position={'relative'}>
                    {room.background.map((layer, index) => <BackDrop key={index} layer={layer} />)}
                    <Box
                        boxSizing={'border-box'}
                        height={room.height * scale}
                        width={room.frameWidth * scale}
                        top={0}
                        left={viewBoxLeft * scale}
                        position={'absolute'}>

                        <Room data={room}
                            viewAngle={viewAngle}
                            handleRoomClick={() => { }}
                            maxHeight={room.height * scale}
                            maxWidth={room.frameWidth * scale}
                        />
                    </Box>
                </Box>
            </RightGridCell>
        </Grid>

        <Grid container>
            <LeftGridCell />
            <RightGridCell>
                <Box width={room.width * scale} display={'flex'} justifyContent={'center'}>
                    <ViewAngleSlider viewAngle={viewAngle} setViewAngle={setViewAngle} />
                </Box>
                <Box width={room.width * scale} display={'flex'} justifyContent={'center'}>
                    <NumberInput label="preview scale" value={scale}
                        inputHandler={setScale} max={1} min={.5} step={.05} />
                </Box>
            </RightGridCell>
        </Grid>
    </Box>

}