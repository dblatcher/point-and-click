import { StoryBoard } from "@/definitions/StoryBoard"
import { Box, Button, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { StoryBoardPageControl } from "./StoryBoardPageControl"
import { ArrayControl } from "../ArrayControl"
import { makeEmptyStoryBoardPage } from "../defaults"

type Props = {
    storyBoard: StoryBoard
    update: { (message: string, mod: Partial<StoryBoard>): void }
}

export const PageMenu = ({
    storyBoard,
    update,
}: Props) => {

    const [currentPageNumber, setCurrentPageNumber] = useState(0)

    useEffect(() => {
        setCurrentPageNumber(0)
    }, [setCurrentPageNumber, storyBoard.id])

    const currentPage = storyBoard.pages[currentPageNumber];

    return (
        <Box display={'flex'} flexDirection={'column'}>
            <Box>
                {currentPage && (
                    <StoryBoardPageControl
                        index={currentPageNumber}
                        update={update}
                        page={currentPage}
                        storyBoard={storyBoard}
                    />
                )}
            </Box>

            <ArrayControl format='cards'
                list={storyBoard.pages}
                createItem={makeEmptyStoryBoardPage}
                describeItem={(page, index) => (
                    <Box key={index}>
                        <Button
                            variant={currentPageNumber === index ? 'contained' : 'outlined'}
                            onClick={() => { setCurrentPageNumber(index) }}>page #{index + 1}</Button>
                        <Typography>{page.title}</Typography>
                    </Box>
                )}
                mutateList={(pages) => {
                    update(`change storyboard ${storyBoard.id}`, { pages })
                }}
            />
        </Box>
    )
}