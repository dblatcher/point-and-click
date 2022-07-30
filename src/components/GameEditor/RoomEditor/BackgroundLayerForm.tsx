/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { useState } from "preact/hooks"
import { ImageAsset } from "../../../services/imageService";
import { BackgroundLayer } from "src";
import { clamp, eventToNumber } from "../../../lib/util";
import { ParallaxInput } from "../formControls";

interface Props {
    imageAssets: Readonly<ImageAsset>[];
    addNewLayer: { (backgroundLayer: BackgroundLayer): void };
}

export function BackgroundLayerForm({ imageAssets, addNewLayer }: Props) {

    const [imageIndex, setImageIndex] = useState<number>(0);
    const [parallax, setParallax] = useState<number>(0);

    return <div>

        <label>ImageAsset:</label>
        <select value={imageIndex} readonly onChange={event => { setImageIndex(eventToNumber(event)) }}>
            {imageAssets.map((asset, index) => <option key={index} value={index}>{asset.id}</option>)}
        </select>

        <ParallaxInput value={parallax}
            onChange={(event) => { setParallax(clamp(eventToNumber(event), 1, 0)) }}
        />

        <button onClick={() => {
            addNewLayer({ imageId: imageAssets[imageIndex].id, parallax })
            setParallax(0)
            setImageIndex(0)
        }}>ADD</button>
    </div>
}