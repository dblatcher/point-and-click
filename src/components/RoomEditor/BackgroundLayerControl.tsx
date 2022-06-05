/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { ImageAsset } from "../../services/imageService";
import { BackgroundLayer } from "../../definitions/RoomData";
import { clamp, eventToNumber } from "../../lib/util";
import { ParallaxInput } from "../formControls";


interface Props {
    index: number;
    layer: BackgroundLayer;
    imageAssets: Readonly<ImageAsset>[];
    remove: { (index: number): void };
    change: { (index: number, propery: keyof BackgroundLayer, newValue: string | number): void };
    move: { (index: number, direction: 'UP' | 'DOWN'): void };
}

export function BackgroundLayerControl({ layer, remove, index, imageAssets, change, move }: Props) {
    const { parallax } = layer
    const assetIndex = imageAssets.findIndex(_ => _.href === layer.url)

    return <div>
        <select value={assetIndex} onChange={(event) => { change(index, 'url', imageAssets[eventToNumber(event)].href) }}>
            {imageAssets.map((asset, index) => <option key={index} value={index}>{asset.id}</option>)}
        </select>

        <ParallaxInput value={parallax}
            onChange={(event) => { change(index, 'parallax', clamp(eventToNumber(event), 1, 0)) }}
        />

        <button onClick={() => remove(index)}>delete</button>
        <button onClick={() => move(index, 'UP')}>up</button>
        <button onClick={() => move(index, 'DOWN')}>down</button>
    </div>
}
