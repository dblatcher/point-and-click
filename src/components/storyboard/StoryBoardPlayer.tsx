import { StoryBoard } from "@/definitions/StoryBoard";
import React, { useEffect, useState } from "react";
import { StoryPageDisplay } from "./StoryPageDisplay";

interface Props {
    storyBoard: StoryBoard
    confirmDone: { (): void }
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
        <StoryPageDisplay page={currentPage} />
        <p>{pageNumber + 1} / {storyBoard.pages.length}</p>
        {onLastPage ? (
            <button onClick={confirmDone}>done</button>
        ) : (
            <button onClick={goToNextPage}>next</button>
        )}
    </article>

}