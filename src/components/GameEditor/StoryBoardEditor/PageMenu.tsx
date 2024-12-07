import { StoryBoard } from "@/definitions/StoryBoard"
import { Box, Button, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { StoryBoardPageControl } from "./StoryBoardPageControl"
import { ArrayControl } from "../ArrayControl"
import { makeEmptyStoryBoardPage } from "../defaults"
import { StoryPageDisplay } from "@/components/storyboard/StoryPageDisplay"
import { EditorBox } from "../EditorBox"
import { AmbientSoundControl } from "../RoomEditor/AmbientSoundControl"
import { SelectInput } from "@/components/SchemaForm/SelectInput"

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
            <EditorBox title="Properties">
                <AmbientSoundControl
                    label="sound"
                    value={storyBoard.sound}
                    setValue={(sound) => update(`set sound on storyboard ${storyBoard.id} `, { sound })} />

                <SelectInput
                    label="progression"
                    value={storyBoard.progression}
                    optional
                    options={['buttons', 'sound']}
                    inputHandler={(progression) => {
                        switch (progression) {
                            case 'buttons':
                            case 'sound':
                            case undefined:
                                update(`set sound on storyboard ${storyBoard.id} `, { progression })
                        }
                    }}
                />
            </EditorBox>
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