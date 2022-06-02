import { h } from "preact";
import { ClickEffect } from "./ClickEffect";
import { HotspotZone, SupportedZoneShape, Zone } from "../../definitions/Zone";

interface Props {
    zone: Zone | HotspotZone;
    index: number;
    remove: { (index: number, type?: string): void };
    move: { (index: number, x: number, y: number, type?: string): void };
    change: { (index: number, propery: SupportedZoneShape, newValue: any, type?: string): void }
    setClickEffect: { (clickEffect: ClickEffect): void }
}

export function ZoneControl({ zone, remove, index, move, change, setClickEffect }: Props) {
    const { x, y, circle, rect, polygon, type } = zone
    const shape: SupportedZoneShape = polygon ? 'polygon' : rect ? 'rect' : circle ? 'circle' : undefined;


    function moveZone(event: Event & { target: HTMLInputElement }, coor: 'x' | 'y') {
        const value = Number(event.target.value)
        if (isNaN(value)) { return }
        const newX = coor === 'x' ? value : x;
        const newY = coor === 'y' ? value : y;
        return move(index, newX, newY, type)
    }

    function changeRadius(event: Event & { target: HTMLInputElement }) {
        const value = Number(event.target.value)
        if (isNaN(value)) { return }
        change(index, 'circle', value, type)
    }
    function changeRect(event: Event & { target: HTMLInputElement }, coor: 'x' | 'y') {
        const value = Number(event.target.value)
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
            {shape === 'circle' && (
                <div>
                    <label>Radius: </label>
                    <input type="number" value={circle} onChange={changeRadius} />
                </div>
            )}
            {shape === 'rect' && (
                <div>
                    <label>Width: </label>
                    <input type="number" value={rect[0]} onChange={event => { changeRect(event, 'x') }} />
                    <label>Height: </label>
                    <input type="number" value={rect[1]} onChange={event => { changeRect(event, 'y') }} />
                </div>
            )}
            {shape === 'polygon' && (
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
            <hr></hr>
        </div>
    )

}