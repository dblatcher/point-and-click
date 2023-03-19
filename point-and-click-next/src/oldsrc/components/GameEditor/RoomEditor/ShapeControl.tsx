/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FunctionComponent } from "react";
import { ClickEffect } from "./ClickEffect";
import { HotspotZone, Shape, Zone, ZoneType } from "src";
import { ListEditor } from "../ListEditor";
import { NumberInput } from "../formControls";

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
            <span>
                <NumberInput label="X" value={x} inputHandler={value => { change(index, 'x', value, type) }} />
                <NumberInput label="Y" value={y} inputHandler={value => { change(index, 'y', value, type) }} />
                <button onClick={() => { remove(index, type) }}>delete</button>
            </span>
            {circle && (
                <div>
                    <NumberInput label="Radius" value={circle} inputHandler={value => { change(index, 'circle', value, type) }} />
                </div>
            )}
            {rect && (
                <div>
                    <NumberInput label="width" value={rect[0]} inputHandler={value => { changeRect(value, 'x') }} />
                    <NumberInput label="height" value={rect[1]} inputHandler={value => { changeRect(value, 'y') }} />
                </div>
            )}
            {polygon && (
                <div>
                    <label>points: </label>
                    <ListEditor
                        list={polygon}
                        mutateList={polygon => change(index, 'polygon', polygon, type)}
                        describeItem={(point, index) => (
                            <li key={index}>[ {point[0]}, {point[1]} ]</li>
                        )}
                    />
                    <button onClick={() => {
                        setClickEffect({
                            type: type === 'hotspot' ? 'POLYGON_POINT_HOTSPOT' : 'POLYGON_POINT_OBSTACLE',
                            index
                        })
                    }}>add points</button>
                </div>
            )}
        </div>
    )
}