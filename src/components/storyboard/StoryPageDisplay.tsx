import { useAssets } from "@/context/asset-context";
import { AspectRatio, StaticFrameParamsS } from "@/definitions/BaseTypes";
import { PagePicture, StoryBoardPage } from "@/definitions/StoryBoard";
import { ImageAsset } from "@/services/assets";
import React, { CSSProperties } from "react";

type Props = {
    page: StoryBoardPage
}

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


const getPictureStyle = (picture: PagePicture): CSSProperties => {
    const { x, y, width: pWdith, height: pHeight } = picture
    const translateX = x === 'center' ? 'translateX(-50%)' : '';
    const translateY = y === 'center' ? 'translateY(-50%)' : '';
    const left = x === 'left' ? 0 : x === 'right' ? undefined : '50%'
    const right = x === 'right' ? 0 : undefined
    const top = y === 'top' ? 0 : y === 'bottom' ? undefined : '50%'
    const bottom = y === 'bottom' ? 0 : undefined

    const width = pWdith ? `${pWdith}%` : undefined
    const height = pHeight ? `${pHeight}%` : undefined

    return {
        position: 'absolute',
        left,
        right,
        width,
        height,
        top,
        bottom,
        transform: `${translateX} ${translateY}`,
        // border: '1px dotted black',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
}

const getAspectRatioStyle = (aspectRatio?: AspectRatio) => {
    return !aspectRatio ? {
        height: '100%',
        width: '100%',
    } : aspectRatio.x < aspectRatio.y ? {
        height: '100%',
        width: 'auto',
        aspectRatio: `${aspectRatio.x}/${aspectRatio.y}`
    } : {
        height: 'auto',
        width: '100%',
        aspectRatio: `${aspectRatio.x}/${aspectRatio.y}`
    }
}

const ImageBlock: React.FunctionComponent<{ frame: StaticFrameParamsS, aspectRatio?: AspectRatio }> = ({ frame, aspectRatio }) => {
    const { getImageAsset } = useAssets()
    const asset = getImageAsset(frame.imageId)
    if (!asset) {
        return null
    }

    // TO DO? aspect ratio not set on 'single frame' assets, which display in natural dims
    // because size == 'contain' - is that what's best? 
    return <div style={getAspectRatioStyle(aspectRatio)}>
        <div role="img" style={{
            ...getBackgroundStyle(asset, frame.col, frame.row),
        }}>
        </div>
    </div>

}

const PagePictureBlock: React.FunctionComponent<{ picture: PagePicture }> = ({ picture }) => {
    return <section style={getPictureStyle(picture)}>
        {picture.image && (
            <ImageBlock frame={picture.image} aspectRatio={picture.aspectRatio} />
        )}
    </section>
}

export const StoryPageDisplay: React.FunctionComponent<Props> = ({ page }) => {

    return <div style={{ flex: 1, position: 'relative' }}>
        {page.pictures.map((element, index) => (
            <PagePictureBlock key={index} picture={element} />
        ))}
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            textAlign: 'center'
        }}>
            <div style={{
                backgroundColor: 'rgba(255,255,255,.5)',
            }}>

                <p style={{ fontSize: '1.5em' }}>
                    <b>{page.title}</b>
                </p>
                {page.narrative.text.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    </div>

}