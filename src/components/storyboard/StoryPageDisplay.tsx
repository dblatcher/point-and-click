import { BoardFont, PagePicture, StoryBoardPage } from "@/definitions/StoryBoard";
import React, { CSSProperties } from "react";
import { FramePreview } from "../GameEditor/SpriteEditor/FramePreview";

type Props = {
    page: StoryBoardPage
    font?: BoardFont
}


const getPictureStyle = (picture: PagePicture): CSSProperties => {
    const { x, y, width: pWdith, height: pHeight } = picture
    const translateX = x === 'center' ? 'translateX(-50%)' : '';
    const translateY = y === 'center' ? 'translateY(-50%)' : '';
    const left = x === 'left' ? 0 : x === 'right' ? undefined : '50%'
    const right = x === 'right' ? 0 : undefined
    const top = y === 'top' ? 0 : y === 'bottom' ? undefined : '50%'
    const bottom = y === 'bottom' ? 0 : undefined

    const width = pWdith ? `${pWdith}em` : undefined
    const height = pHeight ? `${pHeight}em` : undefined

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

    return <FramePreview
        style={getPictureStyle(picture)}
        frame={{ col: 0, row: 0, ...picture.image }}
        aspectRatio={picture.aspectRatio}
        width={1} height={1} />
}

export const StoryPageDisplay: React.FunctionComponent<Props> = ({ page, font }) => {
    const { color, backgroundColor } = page
    return <section style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        color,
        backgroundColor,
        fontFamily: font,
    }}>
        {page.pictures.map((element, index) => (
            <PagePictureBlock key={index} picture={element} />
        ))}
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            textAlign: 'center',
        }}>
            <div>
                <p style={{ fontSize: '1.5em' }}>
                    <b>{page.title}</b>
                </p>
                {page.narrative.text.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    </section>
}