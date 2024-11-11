import { StoryBoard } from "@/definitions/StoryBoard";
import React, { useEffect, useState } from "react";

interface Props {
    storyBoard: StoryBoard
    confirmDone: { (): void }
}

export const StoryBoardPlayer: React.FunctionComponent<Props> = ({ storyBoard, confirmDone }) => {

    const [page, setPage] = useState(0)
    useEffect(() => {
        setPage(0)
    }, [setPage, storyBoard])

    const currentPage = storyBoard.pages[page]
    const onLastPage = page === storyBoard.pages.length - 1

    const goToNextPage = () => {
        setPage(page + 1)
    }

    return <div style={{ border: '1px solid blue' }}>
        <p>{currentPage.title}</p>
        <p>{page + 1} / {storyBoard.pages.length}</p>
        {onLastPage ? (
            <button onClick={confirmDone}>done</button>
        ) : (
            <button onClick={goToNextPage}>next</button>
        )}
    </div>

}