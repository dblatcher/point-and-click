import { StoryPageDisplay } from "@/components/storyboard/StoryPageDisplay"
import { StoryBoard } from "@/definitions/StoryBoard"
import { Box, Button } from "@mui/material"
import { useEffect, useState } from "react"
import { ArrayControl } from "../ArrayControl"
import { makeEmptyStoryBoardPage } from "../defaults"
import { StoryBoardPageControl } from "./StoryBoardPageControl"

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
        <Box display={'flex'} flexDirection={'column'} gap={3}>
               <ArrayControl format='cards'
                list={storyBoard.pages}
                createItem={makeEmptyStoryBoardPage}
                describeItem={(page, index) => (
                    <Button key={index}
                        variant={currentPageNumber === index ? 'contained' : 'outlined'}
                        onClick={() => { setCurrentPageNumber(index) }}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            alignItems: 'center',
                            width: 100,
                        }}
                    >
                        <Box height={75} width={75}
                            display={'flex'}
                            flexDirection={'column'}
                            border={'1px dotted black'}
                            fontSize={3}
                            sx={{ backgroundColor: 'white', color: 'black' }}
                        >
                            <StoryPageDisplay page={page} />
                        </Box>
                    </Button>
                )}
                mutateList={(pages) => {
                    update(`change storyboard ${storyBoard.id}`, { pages })
                }}
            />

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
        </Box>
    )
}