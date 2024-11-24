import { useAssets } from "@/context/asset-context";
import { StaticFrameParamsS } from "@/definitions/BaseTypes";
import { StoryBoard, PagePart } from "@/definitions/StoryBoard";
import React, { CSSProperties, useEffect, useState } from "react";

interface Props {
    storyBoard: StoryBoard
    confirmDone: { (): void }
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


const getStyle = (part: PagePart): CSSProperties => {
    const { x, y, width: pWdith, height: pHeight } = part
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
const ImageBlock: React.FunctionComponent<{ frame: StaticFrameParamsS, }> = ({ frame,  }) => {
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

const PagePartBlock: React.FunctionComponent<{ part: PagePart }> = ({ part }) => {
    return <section style={getStyle(part)}>
        {part.type === 'text' && (<>
            {part.text.map((line, index) => (
                <p key={index} style={{ textAlign: 'center' }} >{line}</p>
            ))}
        </>)}
        {part.type === 'image' && (
            <ImageBlock frame={part.image}/>

        )}
    </section>
}

export const StoryBoardPlayer: React.FunctionComponent<Props> = ({ storyBoard, confirmDone }) => {

    const [pageNumber, setPageNumber] = useState(0)
    useEffect(() => {
        setPageNumber(0)
    }, [setPageNumber, storyBoard])

    const currentPage = storyBoard.pages[pageNumber]
    const onLastPage = pageNumber === storyBoard.pages.length - 1

    const goToNextPage = () => {
        setPageNumber(pageNumber + 1)
    }

    return <article style={{ 
        border: '1px solid blue', 
        width: '100%', 
        height: '100%', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '40vh', // TO DO - address sizing in layouts
     }}>
        <p>{currentPage.title}</p>
        <div style={{ flex: 1, position: 'relative' }}>
            {currentPage.parts.map((element, index) => (
                <PagePartBlock key={index} part={element} />
            ))}
        </div>
        <p>{pageNumber + 1} / {storyBoard.pages.length}</p>
        {onLastPage ? (
            <button onClick={confirmDone}>done</button>
        ) : (
            <button onClick={goToNextPage}>next</button>
        )}
    </article>

}