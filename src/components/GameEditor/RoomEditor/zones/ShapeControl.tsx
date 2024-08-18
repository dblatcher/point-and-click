
import { FunctionComponent } from "react";
import { ClickEffect } from "../ClickEffect";
import { HotspotZone, Shape, Zone, ZoneType } from "@/definitions";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { Stack, Button, Typography, IconButton } from "@mui/material";
import { ArrayControl } from "../../ArrayControl";
import { ClickPointIcon } from "../../material-icons";

export type ValidShapeType = ZoneType;
export type ShapeChangeFunction = { (index: number, propery: Exclude<keyof HotspotZone | keyof Zone, 'type'>, newValue: unknown, type: ValidShapeType): void }

interface Props {
    shape: Shape;
    index: number;
    type: ValidShapeType;
    remove: { (index: number, type: ValidShapeType): void };
    change: ShapeChangeFunction;
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export const ShapeControl: FunctionComponent<Props> = ({ shape, remove, index, change, setClickEffect, type }: Props) => {
    const { x, y, circle, rect, polygon } = shape

    function changeRect(value: number, coor: 'x' | 'y'): void {
        if (!rect) { return }
        const newRect = [
            coor === 'x' ? value : rect[0],
            coor === 'y' ? value : rect[1],
        ]
        change(index, 'rect', newRect, type)
    }

    return (
        <Stack spacing={2}>
            <Stack flexDirection={'row'} spacing={2} alignItems={'flex-end'}>
                <NumberInput label="X" value={x} inputHandler={value => { change(index, 'x', value, type) }} />
                <NumberInput label="Y" value={y} inputHandler={value => { change(index, 'y', value, type) }} />
                <IconButton aria-label="select position"
                    onClick={() => { setClickEffect({ type: 'ZONE_POSITION', index, zoneType: type }) }}
                >
                    <ClickPointIcon fontSize="large" />
                </IconButton>
            </Stack>
            {circle && (
                <Stack flexDirection={'row'} spacing={2} alignItems={'flex-end'}>
                    <NumberInput label="Radius" value={circle} inputHandler={value => { change(index, 'circle', value, type) }} />
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
                        mutateList={polygon => change(index, 'polygon', polygon, type)}
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
        </Stack>
    )
}