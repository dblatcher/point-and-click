import { useState } from "preact/hooks"
import { BackgroundLayer } from "../../definitions/RoomData";
import { clamp } from "../../lib/util";

interface Props {
    urls: string[]
    addNewLayer: { (backgroundLayer: BackgroundLayer): void }
}

export function BackgroundLayerForm({ urls, addNewLayer }: Props) {

    const [urlIndex, setUrlIndex] = useState<number>(0);
    const [parallax, setParallax] = useState<number>(.5);

    return <div>

        <label>URL:</label>
        <select value={urlIndex} readonly onChange={event => { setUrlIndex(event.target.value) }}>
            {urls.map((url, index) => <option value={index}>{url}</option>)}
        </select>

        <label>parallax:</label>
        <input type='number' value={parallax} max={1} min={0} step={.01} onChange={(event) => { setParallax(clamp(event.target.value, 1, 0)) }} />
        <button onClick={() => { 
            addNewLayer({ url: urls[urlIndex], parallax }) 
            setParallax(.5)
            setUrlIndex(0)
        }}>ADD</button>
    </div>
}