
import { FunctionComponent } from "react";
import { ClickEffect } from "./ClickEffect";
import { HotspotZone, Shape, Zone, ZoneType } from "@/definitions";
import { ListEditor } from "../ListEditor";
import { NumberInput } from "@/components/SchemaForm/NumberInput";
import { Stack, Button, Typography } from "@mui/material";

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
        <div>
            <Stack flexDirection={'row'} spacing={2} alignItems={'flex-end'}>
                <NumberInput label="X" value={x} inputHandler={value => { change(index, 'x', value, type) }} />
                <NumberInput label="Y" value={y} inputHandler={value => { change(index, 'y', value, type) }} />
                <Button onClick={() => { remove(index, type) }}>delete</Button>
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
                    <ListEditor tight
                        list={polygon}
                        mutateList={polygon => change(index, 'polygon', polygon, type)}
                        describeItem={(point, index) => (
                            <div key={index}>[ {point[0]}, {point[1]} ]</div>
                        )}
                    />
                    <Button variant="outlined" size="small"
                    onClick={() => {
                        setClickEffect({
                            type: type === 'hotspot' ? 'POLYGON_POINT_HOTSPOT' : 'POLYGON_POINT_OBSTACLE',
                            index
                        })
                    }}>add points</Button>
                </div>
            )}
        </div>
    )
}