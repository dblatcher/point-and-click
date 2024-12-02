import { PagePicture, StoryBoardPage } from "@/definitions/StoryBoard";
import React, { CSSProperties } from "react";
import { ImageBlock } from "../ImageBlock";

type Props = {
    page: StoryBoardPage
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


const PagePictureBlock: React.FunctionComponent<{ picture: PagePicture }> = ({ picture }) => {
    if (!picture.image) {
        return null
    }

    return <section style={getPictureStyle(picture)}>
        <ImageBlock frame={picture.image} aspectRatio={picture.aspectRatio} fitHeight={picture.x === 'center'} />
    </section>
}

export const StoryPageDisplay: React.FunctionComponent<Props> = ({ page }) => {

    return <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
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