/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { BackgroundLayer } from "../../definitions/RoomData";
import { clamp, eventToNumber } from "../../lib/util";
import { ParallaxInput } from "../formControls";


interface Props {
    index: number;
    layer: BackgroundLayer;
    urls: string[];
    remove: { (index: number): void };
    change: { (index: number, propery: keyof BackgroundLayer, newValue: string | number): void };
    move: { (index: number, direction: 'UP' | 'DOWN'): void };
}

export function BackgroundLayerControl({ layer, remove, index, urls, change, move }: Props) {
    const { parallax } = layer
    const urlIndex = urls.indexOf(layer.url)

    return <div>
        <label>URL:</label>{layer.url}
        <select value={urlIndex} onChange={(event) => { change(index, 'url', urls[eventToNumber(event)]) }}>
            {urls.map((url, index) => <option key={index} value={index}>{url}</option>)}
        </select>

        <ParallaxInput value={parallax}
            onChange={(event) => { change(index, 'parallax', clamp(eventToNumber(event), 1, 0)) }}
        />

        <button onClick={() => remove(index)}>delete</button>
        <button onClick={() => move(index, 'UP')}>up</button>
        <button onClick={() => move(index, 'DOWN')}>down</button>
    </div>
}
