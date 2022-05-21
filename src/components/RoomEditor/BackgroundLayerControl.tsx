import { BackgroundLayer } from "../../definitions/RoomData";
import { clamp } from "../../lib/util";

interface Props {
    index: number;
    layer: BackgroundLayer;
    urls: string[];
    remove: { (index: number): void };
    change: { (index: number, propery: string, newValue: any): void };
    move: { (index: number, direction: 'UP' | 'DOWN'): void }
}

export function BackgroundLayerControl({ layer, remove, index, urls, change, move }: Props) {

    const urlIndex = urls.indexOf(layer.url)

    return <div>
        <label>URL:</label>
        <select value={urlIndex} onChange={(event) => { change(index, 'url', urls[Number(event.target.value)]) }}>
            {urls.map((url, index) => <option value={index}>{url}</option>)}
        </select>

        <label>parallax:</label>
        <input type='number'
            value={layer.parallax}
            max={1} min={0} step={.01}
            onChange={(event) => { change(index, 'parallax', clamp(Number(event.target.value), 1, 0)) }}
        />

        <button onClick={() => remove(index)}>delete</button>
        <button onClick={() => move(index,'UP')}>up</button>
        <button onClick={() => move(index,'DOWN')}>down</button>
    </div>
}
