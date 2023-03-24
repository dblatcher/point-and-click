import { useState } from "react"
import { ImageAsset } from "@/services/imageService";
import { BackgroundLayer } from "../../../";
import { ParallaxInput, SelectInput } from "../formControls";
import { icons } from "../dataEditors";
import { listIds } from "../../../../lib/util";
import editorStyles from "../editorStyles.module.css";

interface Props {
    imageAssets: Readonly<ImageAsset>[];
    addNewLayer: { (backgroundLayer: BackgroundLayer): void };
}

export function BackgroundLayerForm({ imageAssets, addNewLayer }: Props) {

    const [imageId, setImageId] = useState<string>('');
    const [parallax, setParallax] = useState<number>(0);

    return <div>

        <SelectInput
            value={imageId}
            items={listIds(imageAssets)}
            onSelect={setImageId}
            haveEmptyOption
            emptyOptionLabel='select background'
        />

        <ParallaxInput
            value={parallax}
            inputHandler={setParallax}
        />

        <button
            className={[editorStyles.button, editorStyles.plusButton].join(" ")}
            onClick={() => {
                if (!imageId) { return }
                addNewLayer({ imageId, parallax })
                setParallax(0)
                setImageId('')
            }}>{icons.INSERT} background</button>
    </div>
}