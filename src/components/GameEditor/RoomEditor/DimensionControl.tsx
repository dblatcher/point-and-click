import { FieldValue } from "@/components/SchemaForm";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { Room } from "@/components/svg/Room";
import { useGameDesign } from "@/context/game-design-context";
import { RoomData } from "@/definitions";
import { Alert, Box, Grid, Stack } from "@mui/material";
import { ReactNode, useState } from "react";
import { ViewAngleSlider } from "./ViewAngleSlider";
import { BackDrop } from "./background/Backdrop";

interface Props {
    room: RoomData
}

const RightGridCell = ({ children, row }: { children?: ReactNode, row?: boolean }) => <Grid
    item xs={10}
    padding={1}
    flexDirection={row ? 'row' : 'column'}
    display={'flex'}
    gap={2}
    justifyContent={row ? 'flex-start' : 'center'}
    alignItems={row ? 'center' : 'flex-start'}>
    {children}</Grid>
const LeftGridCell = ({ children }: { children?: ReactNode }) => <Grid
    item xs={2}
    padding={1}
    flexDirection={'column'}
    justifyContent={'center'}
    display={'flex'}>
    {children}</Grid>


export const DimensionControl = ({ room }: Props) => {
    const { modifyRoom } = useGameDesign()
    const [scale, setScale] = useState(1)
    const [viewAngleX, setViewAngleX] = useState(0)
    const [viewAngleY, setViewAngleY] = useState(0)
    const updateRoom = (mod: Record<string, FieldValue>) => {
        modifyRoom(`change dimension on room ${room.id}`, room.id, mod)
    }
    const frameCenterX = (room.width * .5) - (room.frameWidth * .5);
    const viewBoxLeft = frameCenterX - (viewAngleX * frameCenterX);

    const frameCenterY = (room.height * .5) - ((room.frameHeight ?? room.height) * .5);
    const viewBoxTop = frameCenterY - (viewAngleY * frameCenterY);

    return <Box width={room.width * scale * (12 / 10)} padding={2}>
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
                <NumberInput label="frameHeight" value={room.frameHeight ?? room.height}
                    inputHandler={(frameHeight) => { updateRoom({ frameHeight }) }} />
            </LeftGridCell>
            <RightGridCell>
                <Box 
                    bgcolor={room.backgroundColor ?? 'white'} 
                    width={room.width * scale} 
                    height={(room.height) * scale} 
                    position={'relative'}
                    overflow={'clip'}
                >
                    {room.background.map((layer, index) => <BackDrop key={index} roomData={room} layer={layer} filter='saturate(.15) brightness(.4)' />)}
                    <Box
                        boxSizing={'border-box'}
                        height={room.height * scale}
                        width={room.frameWidth * scale}
                        top={viewBoxTop * scale}
                        left={viewBoxLeft * scale}
                        position={'absolute'}>

                        <Room data={room} noSound
                            viewAngleX={viewAngleX}
                            viewAngleY={viewAngleY}
                            handleRoomClick={() => { }}
                            maxHeight={room.height * scale}
                            maxWidth={room.frameWidth * scale}
                        />
                    </Box>
                </Box>
            </RightGridCell>
        </Grid>

        <Grid> 
            <LeftGridCell />
            <RightGridCell>
                <Box width={room.width * scale} display={'flex'} justifyContent={'center'}>
                    X: <ViewAngleSlider viewAngle={viewAngleX} setViewAngle={setViewAngleX} />
                </Box>
                <Box width={room.width * scale} display={'flex'} justifyContent={'center'}>
                    Y:  <ViewAngleSlider viewAngle={viewAngleY} setViewAngle={setViewAngleY} />
                </Box>
                <Box width={room.width * scale} display={'flex'} justifyContent={'center'}>
                    <NumberInput label="preview scale" value={scale} notFullWidth
                        inputHandler={setScale} max={2} min={.5} step={.05} />
                </Box>
            </RightGridCell>
        </Grid>
    </Box>

}