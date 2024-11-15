import { useAssets } from "@/context/asset-context";
import { StoryBoard, PagePart } from "@/definitions/StoryBoard";
import React, { CSSProperties, useEffect, useState } from "react";

interface Props {
    storyBoard: StoryBoard
    confirmDone: { (): void }
}


const getStyle = (part: PagePart): CSSProperties => {
    const { x, y } = part
    const translateX = x === 'center' ? 'translateX(-50%)' : '';
    const translateY = y === 'center' ? 'translateY(-50%)' : '';
    const left = x === 'left' ? 0 : x === 'right' ? undefined : '50%'
    const right = x === 'right' ? 0 : undefined
    const top = y === 'top' ? 0 : y === 'bottom' ? undefined : '50%'
    const bottom = y === 'bottom' ? 0 : undefined

    return {
        position: 'absolute',
        left,
        right,
        top,
        bottom,
        transform: `${translateX} ${translateY}`
    }
}

const PagePartBlock: React.FunctionComponent<{ part: PagePart }> = ({ part: part }) => {

    const { getImageAsset } = useAssets()

    return <section style={getStyle(part)}>
        {part.type === 'text' && (
            <span>{part.text}</span>
        )}
        {part.type === 'image' && (
            <img alt='' src={getImageAsset(part.imageAssetId)?.href} />
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

    return <article style={{ border: '1px solid blue', width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
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