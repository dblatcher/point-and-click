import { useAssets } from "@/context/asset-context";
import { StaticFrameParamsS } from "@/definitions/BaseTypes";
import { PagePicture, StoryBoardPage } from "@/definitions/StoryBoard";
import React, { CSSProperties } from "react";

type Props = {
    page: StoryBoardPage
}

// TO DO - refactor to helper, use in ItemMenu etc
const getBackgroundStyle = (imageUrl: string, col = 0, row = 0, cols?: number | undefined, rows?: number | undefined) => {
    if (typeof cols === 'undefined' && typeof rows === 'undefined') {
        return {
            backgroundImage: `url(${imageUrl})`,
            width: '100%',
            height: '100%',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        }
    }

    return {
        backgroundImage: `url(${imageUrl})`,
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
        backgroundColor: 'pink',
        border: '1px dotted black',

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',

    }
}

// TO DO - control asset ratio
const ImageBlock: React.FunctionComponent<{ frame: StaticFrameParamsS, }> = ({ frame, }) => {
    const { getImageAsset } = useAssets()
    const asset = getImageAsset(frame.imageId)
    if (!asset) {
        return null
    }
    return <div role="img" style={{
        ...getBackgroundStyle(asset.href, frame.col, frame.row, asset.cols, asset.rows),
        // width: '50%',
        // left: '25%',
        // position: 'relative',
    }}></div>

}

const PagePictureBlock: React.FunctionComponent<{ picture: PagePicture }> = ({ picture }) => {
    return <section style={getPictureStyle(picture)}>
        {picture.image && (
            <ImageBlock frame={picture.image} />
        )}
    </section>
}

export const StoryPageDisplay: React.FunctionComponent<Props> = ({ page }) => {

    return <div style={{ flex: 1, position: 'relative' }}>
        {page.pictures.map((element, index) => (
            <PagePictureBlock key={index} picture={element} />
        ))}
        <div style={{ position: 'absolute', inset: 0 }}>
            {page.narrative.text.map((line, index) => (
                <p key={index} style={{ textAlign: 'left' }} >{line}</p>
            ))}
        </div>
    </div>

}