import { useAssets } from "@/context/asset-context";
import { AspectRatio, StaticFrameParamsS } from "@/definitions/BaseTypes";
import { ImageAsset } from "@/services/assets";
import React from "react";

// TO DO - refactor to helper, use in ItemMenu etc
const getBackgroundStyle = (imageAsset: ImageAsset, col = 0, row = 0) => {
    const { href, rows, cols } = imageAsset

    if (typeof cols === 'undefined' && typeof rows === 'undefined') {
        return {
            backgroundImage: `url(${href})`,
            width: '100%',
            height: '100%',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        }
    }

    return {
        backgroundImage: `url(${href})`,
        backgroundPositionX: `${-100 * col}%`,
        backgroundPositionY: `${-100 * row}%`,
        backgroundSize: `${100 * (cols || 1)}% ${100 * (rows || 1)}%`,
        width: '100%',
        height: '100%',
    }
}

const getAspectRatioStyle = (aspectRatio?: AspectRatio) => {
    return !aspectRatio ? {
        height: '100%',
        width: '100%',
        margin: 0,
    } : aspectRatio.x < aspectRatio.y ? {
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

export const ImageBlock: React.FunctionComponent<{ frame: StaticFrameParamsS, aspectRatio?: AspectRatio }> = ({ frame, aspectRatio }) => {
    const { getImageAsset } = useAssets()
    const asset = getImageAsset(frame.imageId)
    if (!asset) {
        return null
    }

    // TO DO? aspect ratio not set on 'single frame' assets, which display in natural dims
    // because size == 'contain' - is that what's best? 
    return <figure role="img" style={getAspectRatioStyle(aspectRatio)}>
        <div style={{
            ...getBackgroundStyle(asset, frame.col, frame.row),
        }}>
        </div>
    </figure>

}
