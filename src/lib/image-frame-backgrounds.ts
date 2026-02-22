import { ImageAsset } from "@/services/assets"
import { AspectRatio } from "point-click-lib"
import { CSSProperties } from "react"


export const getAspectRatioStyle = (aspectRatio?: AspectRatio, fitHeight = false) => {
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

export const getBackgroundStyle = (imageAsset: ImageAsset, col = 0, row = 0, filter?: string): CSSProperties => {
    const { href, rows, cols } = imageAsset

    if (typeof cols === 'undefined' && typeof rows === 'undefined') {
        return {
            backgroundImage: `url(${href})`,
            width: '100%',
            height: '100%',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            filter,
        }
    }

    return {
        backgroundImage: `url(${href})`,
        backgroundPositionX: `${-100 * col}%`,
        backgroundPositionY: `${-100 * row}%`,
        backgroundSize: `${100 * (cols || 1)}% ${100 * (rows || 1)}%`,
        width: '100%',
        height: '100%',
        filter,
    }
}
