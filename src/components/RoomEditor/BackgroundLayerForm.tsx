/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact";
import { useState } from "preact/hooks"
import { BackgroundLayer } from "../../definitions/RoomData";
import { clamp, eventToNumber } from "../../lib/util";
import { ParallaxInput } from "../formControls";

interface Props {
    urls: string[];
    addNewLayer: { (backgroundLayer: BackgroundLayer): void };
}

export function BackgroundLayerForm({ urls, addNewLayer }: Props) {

    const [urlIndex, setUrlIndex] = useState<number>(0);
    const [parallax, setParallax] = useState<number>(0);

    return <div>

        <label>URL:</label>
        <select value={urlIndex} readonly onChange={event => { setUrlIndex(eventToNumber(event)) }}>
            {urls.map((url, index) => <option key={index} value={index}>{url}</option>)}
        </select>

        <ParallaxInput value={parallax}
            onChange={(event) => { setParallax(clamp(eventToNumber(event), 1, 0)) }}
        />

        <button onClick={() => {
            addNewLayer({ url: urls[urlIndex], parallax })
            setParallax(0)
            setUrlIndex(0)
        }}>ADD</button>
    </div>
}