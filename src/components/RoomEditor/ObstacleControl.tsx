import { SupportedZoneShape, Zone } from "../../definitions/Zone";

interface Props {
    obstacle: Zone;
    index: number;
    remove: { (index: number): void };
    move: { (index: number, x: number, y: number): void };
    change: { (index: number, propery: SupportedZoneShape, newValue: any): void }
}

export function ObstacleControl({ obstacle, remove, index, move, change }: Props) {
    const { x, y, circle, rect, polygon } = obstacle
    const type: SupportedZoneShape = polygon ? 'polygon' : rect ? 'rect' : circle ? 'circle' : undefined;


    function makeMoveFromEvent(event: React.ChangeEvent<HTMLInputElement>, coor: 'x' | 'y') {
        const value = Number(event.target.value)
        if (isNaN(value)) { return }
        const newX = coor === 'x' ? value : x;
        const newY = coor === 'y' ? value : y;
        return move(index, newX, newY)
    }

    function changeRadius(event: React.ChangeEvent<HTMLInputElement>) {
        const value = Number(event.target.value)
        if (isNaN(value)) { return }
        change(index, 'circle', value)
    }
    function changeRect(event: React.ChangeEvent<HTMLInputElement>, coor:'x'|'y') {
        const value = Number(event.target.value)
        if (isNaN(value)) { return }

        const newRect = [
            coor === 'x' ? value : rect[0],
            coor === 'y' ? value : rect[1],
        ]

        change(index, 'rect', newRect)
    }

    return (
        <div>
            <div><strong>{type}</strong></div>
            <span>
                <label>X: </label>
                <input type="number" value={x} onChange={(event) => { makeMoveFromEvent(event, 'x') }} />
                <label>Y: </label>
                <input type="number" value={y} onChange={(event) => { makeMoveFromEvent(event, 'y') }} />
                <button onClick={() => { remove(index) }}>delete</button>
            </span>
            {type === 'circle' && (
                <div>
                    <label>Radius: </label>
                    <input type="number" value={circle} onChange={changeRadius} />
                </div>
            )}
            {type === 'rect' && (
                <div>
                    <label>width: </label>
                    <input type="number" value={rect[0]} onChange={event => {changeRect(event, 'x')}} />
                    <label>height: </label>
                    <input type="number" value={rect[1]} onChange={event => {changeRect(event, 'y')}} />
                </div>
            )}
            <hr></hr>
        </div>
    )

}