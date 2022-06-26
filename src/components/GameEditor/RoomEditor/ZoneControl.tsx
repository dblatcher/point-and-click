/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h, FunctionalComponent, JSX } from "preact";
import { ClickEffect } from "./ClickEffect";
import { HotspotZone, SupportedZoneShape, Zone } from "../../../definitions/Zone";

interface Props {
    zone: Zone | HotspotZone;
    index: number;
    remove: { (index: number, type?: string): void };
    move: { (index: number, x: number, y: number, type?: string): void };
    change: { (index: number, propery: SupportedZoneShape, newValue: unknown, type?: string): void };
    setClickEffect: { (clickEffect: ClickEffect): void };
}

export const ZoneControl: FunctionalComponent<Props> = ({ zone, remove, index, move, change, setClickEffect }: Props) => {
    const { x, y, circle, rect, polygon, type } = zone

    function moveZone(event: JSX.TargetedEvent<HTMLInputElement,Event>, coor: 'x' | 'y'): void {
        const value = Number((event.target as HTMLInputElement).value)
        if (isNaN(value)) { return }
        const newX = coor === 'x' ? value : x;
        const newY = coor === 'y' ? value : y;
        return move(index, newX, newY, type)
    }

    function changeRadius(event: JSX.TargetedEvent<HTMLInputElement,Event>): void {
        const value = Number((event.target as HTMLInputElement).value)
        if (isNaN(value)) { return }
        change(index, 'circle', value, type)
    }
    function changeRect(event: JSX.TargetedEvent<HTMLInputElement,Event>, coor: 'x' | 'y'): void {
        if (!rect) { return }
        const value = Number((event.target as HTMLInputElement).value)
        if (isNaN(value)) { return }

        const newRect = [
            coor === 'x' ? value : rect[0],
            coor === 'y' ? value : rect[1],
        ]

        change(index, 'rect', newRect, type)
    }

    return (
        <div>
            <span>
                <label>X: </label>
                <input type="number" value={x} onChange={(event) => { moveZone(event, 'x') }} />
                <label>Y: </label>
                <input type="number" value={y} onChange={(event) => { moveZone(event, 'y') }} />
                <button onClick={() => { remove(index, type) }}>delete</button>
            </span>
            {circle && (
                <div>
                    <label>Radius: </label>
                    <input type="number" value={circle} onChange={changeRadius} />
                </div>
            )}
            {rect && (
                <div>
                    <label>Width: </label>
                    <input type="number" value={rect[0]} onChange={event => { changeRect(event, 'x') }} />
                    <label>Height: </label>
                    <input type="number" value={rect[1]} onChange={event => { changeRect(event, 'y') }} />
                </div>
            )}
            {polygon && (
                <div>
                    <label>points: </label>
                    <ol>
                        {polygon.map((point, index) => (
                            <li key={index}>[ {point[0]}, {point[1]} ]</li>
                        ))}
                    </ol>
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