
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { HotspotZone, Shape, Zone, ZoneType } from "point-click-lib";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { ArrayControl } from "../../ArrayControl";
import { ClickPointIcon, ClickPointActiveIcon } from "../../material-icons";
import { useRoomClickEffect } from "../ClickEffect";
import { XYControl } from "../../XYControl";
import { XY } from "typed-geometry";

interface Props {
    shape: HotspotZone | Zone;
    index: number;
    type: ZoneType;
    changeHotSpotOrZone: { (index: number, mod: Partial<Shape>): void }
}

export const ShapeControl = ({ shape, index, changeHotSpotOrZone, type }: Props) => {
    const { circle, rect, polygon } = shape
    const { setClickEffect, clickEffect } = useRoomClickEffect()

    function changeRect(value: number, coor: 'x' | 'y'): void {
        if (!rect) { return }
        const newRect: [number, number] = [
            coor === 'x' ? value : rect[0],
            coor === 'y' ? value : rect[1],
        ]
        changeHotSpotOrZone(index, { rect: newRect })
    }

    const changePolygonPoint = (pointIndex: number, mod: Partial<XY>) => {
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

    const polygonPointButtonIsActive =
        clickEffect?.type === 'ADD_POLYGON_POINT' &&
        clickEffect?.zoneType === type &&
        clickEffect.index === index;

    return (
        <>
            {circle && (
                <Stack flexDirection={'row'} spacing={2} gap={2} alignItems={'flex-end'}>
                    <Typography variant='overline'>Circle: </Typography>
                    <Box maxWidth={60}>
                        <NumberInput label="Radius" value={circle} inputHandler={circle => { changeHotSpotOrZone(index, { circle }) }} />
                    </Box>
                </Stack>
            )}
            {rect && (
                <Stack flexDirection={'row'} spacing={2} gap={2} alignItems={'flex-end'}>
                    <Typography variant='overline'>Rectangle: </Typography>
                    <Box maxWidth={60}>
                        <NumberInput label="width"
                            value={rect[0]}
                            inputHandler={value => { changeRect(value, 'x') }} />
                    </Box>
                    <Box maxWidth={60}>
                        <NumberInput label="height"
                            value={rect[1]}
                            inputHandler={value => { changeRect(value, 'y') }} />
                    </Box>
                </Stack>
            )}
            {polygon && (
                <Box>
                    <Typography variant='overline'>polygon: </Typography>
                    <ArrayControl horizontalMoveButtons
                        buttonSize="small"
                        list={polygon}
                        mutateList={polygon => changeHotSpotOrZone(index, { polygon })}
                        describeItem={([x, y], pointIndex) => (
                            <Box display={'flex'} key={pointIndex} alignItems={'center'} gap={2}>
                                <Avatar sx={{ bgcolor: 'black', width: 20, height: 20, fontSize: 'small' }}>{pointIndex + 1}</Avatar>
                                <XYControl
                                    point={{ x, y }}
                                    index={pointIndex}
                                    changePosition={changePolygonPoint}
                                    handlePositionSelectButton={() => {
                                        setClickEffect({
                                            pointIndex,
                                            type: 'MOVE_POLYGON_POINT',
                                            index,
                                            zoneType: type
                                        })
                                    }}
                                    positionSelectIsActive={clickEffect?.type === 'MOVE_POLYGON_POINT' && clickEffect.pointIndex === pointIndex && clickEffect.index === index && clickEffect.zoneType === type}
                                />
                            </Box>
                        )}
                    />
                    <Button variant={polygonPointButtonIsActive ? 'contained' : "outlined"} size="small"
                        startIcon={polygonPointButtonIsActive ? <ClickPointActiveIcon /> : <ClickPointIcon />}
                        onClick={() => {
                            setClickEffect({
                                type: 'ADD_POLYGON_POINT',
                                zoneType: type,
                                index
                            })
                        }}>add points</Button>
                </Box>
            )}
        </>
    )
}