
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { HotspotZone, Point, Shape, Zone, ZoneType } from "@/definitions";
import { Avatar, Box, Button, Chip, Icon, Stack, Typography } from "@mui/material";
import { ArrayControl } from "../../ArrayControl";
import { ClickPointIcon } from "../../material-icons";
import { useRoomClickEffect } from "../ClickEffect";
import { XYControl } from "./XYControl";

interface Props {
    shape: HotspotZone | Zone;
    index: number;
    type: ZoneType;
    changeHotSpotOrZone: { (index: number, mod: Partial<Shape>): void }
}

export const ShapeControl = ({ shape, index, changeHotSpotOrZone, type }: Props) => {
    const { circle, rect, polygon } = shape
    const { setClickEffect } = useRoomClickEffect()

    function changeRect(value: number, coor: 'x' | 'y'): void {
        if (!rect) { return }
        const newRect: [number, number] = [
            coor === 'x' ? value : rect[0],
            coor === 'y' ? value : rect[1],
        ]
        changeHotSpotOrZone(index, { rect: newRect })
    }

    const changePolygonPoint = (pointIndex: number, mod: Partial<Point>) => {
        const pointToChange = polygon?.[pointIndex]
        if (!pointToChange) {
            return
        }
        const moddedPoint: [number, number] = [pointToChange[0], pointToChange[1]]
        if (typeof mod.x === 'number') {
            moddedPoint[0] = mod.x as number
        }
        if (typeof mod.y === 'number') {
            moddedPoint[1] = mod.y as number
        }
        const newPolygon = [...polygon.slice(0, pointIndex), moddedPoint, ...polygon.slice(pointIndex + 1)]
        changeHotSpotOrZone(index, { polygon: newPolygon })
    }

    return (
        <>
            {circle && (
                <Stack flexDirection={'row'} spacing={2} alignItems={'flex-end'}>
                    <NumberInput label="Radius" value={circle} inputHandler={circle => { changeHotSpotOrZone(index, { circle }) }} />
                </Stack>
            )}
            {rect && (
                <Stack flexDirection={'row'} spacing={2} alignItems={'flex-end'}>
                    <NumberInput label="width" value={rect[0]} inputHandler={value => { changeRect(value, 'x') }} />
                    <NumberInput label="height" value={rect[1]} inputHandler={value => { changeRect(value, 'y') }} />
                </Stack>
            )}
            {polygon && (
                <Box>
                    <Typography variant='overline'>points: </Typography>
                    <ArrayControl horizontalMoveButtons
                        buttonSize="small"
                        list={polygon}
                        mutateList={polygon => changeHotSpotOrZone(index, { polygon })}
                        describeItem={([x, y], index) => (
                            <Box display={'flex'} key={index} alignItems={'center'} gap={2}>
                                <Avatar sx={{ bgcolor: 'black', width: 20, height: 20, fontSize: 'small' }}>{index + 1}</Avatar>
                                <XYControl
                                    point={{ x, y }}
                                    index={index}
                                    changePosition={changePolygonPoint}
                                />
                            </Box>
                        )}
                    />
                    <Button variant="outlined" size="small"
                        startIcon={<ClickPointIcon fontSize="large" />}
                        onClick={() => {
                            setClickEffect({
                                type: type === 'hotspot' ? 'POLYGON_POINT_HOTSPOT' : 'POLYGON_POINT_OBSTACLE',
                                index
                            })
                        }}>add points</Button>
                </Box>
            )}
        </>
    )
}