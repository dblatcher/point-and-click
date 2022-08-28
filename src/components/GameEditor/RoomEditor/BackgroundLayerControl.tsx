/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { ImageAsset } from "../../../services/imageService";
import { BackgroundLayer } from "src";
import { clamp, eventToNumber } from "../../../lib/util";
import { ParallaxInput } from "../formControls";


interface Props {
    index: number;
    layer: BackgroundLayer;
    imageAssets: Readonly<ImageAsset>[];
    change: { (index: number, propery: keyof BackgroundLayer, newValue: string | number): void };
}

export function BackgroundLayerControl({ layer,  index, imageAssets, change }: Props) {
    const { parallax } = layer
    const assetIndex = imageAssets.findIndex(_ => _.id === layer.imageId)

    return <div>
        <select value={assetIndex} onChange={(event) => { change(index, 'imageId', imageAssets[eventToNumber(event)].id) }}>
            {imageAssets.map((asset, index) => <option key={index} value={index}>{asset.id}</option>)}
        </select>

        <ParallaxInput value={parallax}
            onChange={(event) => { change(index, 'parallax', clamp(eventToNumber(event), 2, 0)) }}
        />
    </div>
}
