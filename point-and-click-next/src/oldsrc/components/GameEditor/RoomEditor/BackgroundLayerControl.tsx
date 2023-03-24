import { ImageAsset } from "@/services/imageService";
import { BackgroundLayer } from "../../../";
import { clamp, listIds } from "../../../../lib/util";
import { ParallaxInput, SelectInput } from "../formControls";


interface Props {
    index: number;
    layer: BackgroundLayer;
    imageAssets: Readonly<ImageAsset>[];
    change: { (index: number, propery: keyof BackgroundLayer, newValue: string | number): void };
}

export function BackgroundLayerControl({ layer,  index, imageAssets, change }: Props) {
    const { parallax, imageId } = layer

    return <div>
        <SelectInput
            value={imageId}
            items={listIds(imageAssets)}
            onSelect={(value) => { change(index, 'imageId', value) }}
            haveEmptyOption
            emptyOptionLabel='select background'
        />
        <ParallaxInput value={parallax}
            inputHandler={(value) => { change(index, 'parallax', clamp(value, 2, 0)) }}
        />
    </div>
}
