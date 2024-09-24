
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { HotspotZone, Shape, Zone, ZoneType } from "@/definitions";
import { Button, Stack, Typography } from "@mui/material";
import { ArrayControl } from "../../ArrayControl";
import { ClickPointIcon } from "../../material-icons";
import { useRoomClickEffect } from "../ClickEffect";

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
                <div>
                    <Typography variant='overline'>points: </Typography>
                    <ArrayControl horizontalMoveButtons
                        buttonSize="small"
                        list={polygon}
                        mutateList={polygon => changeHotSpotOrZone(index, {polygon})}
                        describeItem={(point, index) => (
                            <div key={index}>[ {point[0]}, {point[1]} ]</div>
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
                </div>
            )}
        </>
    )
}