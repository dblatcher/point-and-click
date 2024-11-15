import { useGameDesign } from "@/context/game-design-context";
import { StoryBoard } from "@/definitions/StoryBoard";
import { patchMember } from "@/lib/update-design";
import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ArrayControl } from "./ArrayControl";
import { EditorHeading } from "./EditorHeading";
import { ItemEditorHeaderControls } from "./ItemEditorHeaderControls";
import { StoryBoardPageControl } from "./StoryBoardPageControl";
import { makeEmptyStoryBoardPage } from "./defaults";

interface Props {
    storyBoard: StoryBoard
}

export const StoryBoardEditor: React.FunctionComponent<Props> = ({ storyBoard }) => {
    const { applyModification, gameDesign } = useGameDesign()
    const [openPages, setOpenPages] = useState<number[]>([])

    useEffect(() => {
        setOpenPages([])
    }, [setOpenPages, storyBoard.id])

    const update = (message: string, mod: Partial<StoryBoard>) => {
        return applyModification(
            message,
            { storyBoards: patchMember(storyBoard.id, mod, gameDesign.storyBoards ?? []) }
        )
    }

    const isOpen = (index: number) => openPages.includes(index)

    const openPage = (index: number) => {
        if (isOpen(index)) {
            return
        }
        setOpenPages([...openPages, index])
    }

    const closePage = (index: number) => {
        setOpenPages(openPages.filter(p => p !== index))
    }

    return <Stack spacing={2}>
        <EditorHeading heading="Story Board Editor" itemId={storyBoard.id} >
            <ItemEditorHeaderControls
                dataItem={storyBoard} itemType='storyBoards' itemTypeName="story board"
            />
        </EditorHeading>

        <ArrayControl
            list={storyBoard.pages}
            createItem={makeEmptyStoryBoardPage}
            describeItem={(page, index) => (
                <StoryBoardPageControl
                    isOpen={isOpen}
                    openPage={openPage}
                    closePage={closePage}
                    index={index}
                    update={update}
                    page={page}
                    storyBoard={storyBoard}
                />
            )}
            mutateList={(pages) => {
                update(`change storyboard ${storyBoard.id}`, { pages })
            }}
        />

    </Stack>
}