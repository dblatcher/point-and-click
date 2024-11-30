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

    const pagination = <span>{pageNumber + 1} / {storyBoard.pages.length}</span>

    return <article style={{
        backgroundColor: 'darkgray',
        width: '100%',
        height: '100%',
        position: 'fixed',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
    }}>
        <StoryPageDisplay page={currentPage} />
        {onLastPage ? (
            <button onClick={confirmDone}>{pagination} done</button>
        ) : (
            <button onClick={goToNextPage}>{pagination} next</button>
        )}
    </article>

}