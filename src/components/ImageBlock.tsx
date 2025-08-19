import { useAssets } from "@/context/asset-context";
import { AspectRatio, StaticFrameParamsS } from "@/definitions/BaseTypes";
import { getBackgroundStyle } from "@/lib/image-frame-backgrounds";
import React from "react";

interface Props {
    frame: StaticFrameParamsS,
    aspectRatio?: AspectRatio,
    filter?: string,
    fitHeight?: boolean,
}


const getAspectRatioStyle = (aspectRatio?: AspectRatio, fitHeight = false) => {
    return !aspectRatio ? {
        height: '100%',
        width: '100%',
        margin: 0,
    } : fitHeight ? {
        height: '100%',
        width: 'auto',
        aspectRatio: `${aspectRatio.x}/${aspectRatio.y}`,
        margin: 0,
    } : {
        height: 'auto',
        width: '100%',
        aspectRatio: `${aspectRatio.x}/${aspectRatio.y}`,
        margin: 0,
    }
}

export const ImageBlock: React.FunctionComponent<Props> = ({ frame, aspectRatio, filter, fitHeight }) => {
    const { getImageAsset } = useAssets()
    const asset = getImageAsset(frame.imageId)
    if (!asset) {
        return null
    }

    // TO DO? aspect ratio not set on 'single frame' assets, which display in natural dims
    // because size == 'contain' - is that what's best? 
    return <figure role="img" style={getAspectRatioStyle(aspectRatio, fitHeight)}>
        <div style={{
            ...getBackgroundStyle(asset, frame.col, frame.row, filter),
        }}>
        </div>
    </figure>

}
