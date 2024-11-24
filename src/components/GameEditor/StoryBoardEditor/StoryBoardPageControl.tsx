import { PagePart, StoryBoard, StoryBoardPage } from "@/definitions/StoryBoard";
import { cloneArrayWithPatch, cloneData } from "@/lib/clone";
import { Box } from "@mui/material";
import React from "react";
import { StringInput } from "../../SchemaForm/StringInput";
import { ArrayControl } from "../ArrayControl";
import { EditorBox } from "../EditorBox";
import { FramePickDialogButton } from "../FramePickDialogButton";
import { NarrativeEditor } from "../NarrativeEditor";
import { FramePreview } from "../SpriteEditor/FramePreview";
import { StoryPageDisplay } from "@/components/storyboard/StoryPageDisplay";

interface Props {
    storyBoard: StoryBoard
    page: StoryBoardPage
    index: number
    update: { (message: string, mod: Partial<StoryBoard>): void }
}

const PagePartControl = ({
    part,
    partIndex,
    updatePart,
}: {
    part: PagePart
    partIndex: number,
    updatePart: { (mod: Partial<PagePart>, partIndex: number): void }

}) => {
    const { imageId, row = 0, col = 0 } = part.image ?? {};

    const pickFrame = (row: number, col: number, imageId?: string) => {
        if (!imageId) {
            updatePart({
                image: undefined
            }, partIndex)
            return
        }
        updatePart({
            image: { row, col, imageId }
        }, partIndex)
    }


    return <Box padding={2} display={'flex'}>
        <NarrativeEditor
            narrative={part.narrative}
            update={(narrative) => {
                updatePart({ narrative }, partIndex)
            }} />

        {!!imageId && (
            <FramePreview frame={{ imageId, row, col }} width={50} height={50} />
        )}
        <FramePickDialogButton pickFrame={pickFrame} buttonLabel={imageId ? 'change image' : 'add image'} />
    </Box>
}

export const StoryBoardPageControl: React.FunctionComponent<Props> = ({
    storyBoard, page, index, update,
}) => {

    const pageDescription = `storyboard ${storyBoard.id} page #${index + 1}`;

    const updatePart = (mod: Partial<PagePart>, partIndex: number) => {
        const newPage = {
            ...page,
            parts: cloneArrayWithPatch(page.parts, mod, partIndex)
        }
        update(
            `change ${pageDescription} part #${partIndex}`,
            { pages: cloneArrayWithPatch(storyBoard.pages, newPage, index) }
        )
    }

    return (

        <EditorBox title={page.title}>

            <StringInput label="title" value={page.title} inputHandler={newTitle => {
                const newPages = cloneData(storyBoard.pages)
                const pageToEdit = newPages[index]
                if (pageToEdit) {
                    pageToEdit.title = newTitle
                }
                update(
                    `change storyboard ${storyBoard.id} page #${index + 1} to "${newTitle}"`,
                    { pages: newPages }
                )
            }}
            />


            <Box display={'flex'}>

                <ArrayControl horizontalMoveButtons buttonSize={'small'}
                    list={page.parts}
                    mutateList={(newParts) => {
                        const message = newParts.length === page.parts.length ? `change part order in ${pageDescription}` : `delete part from ${pageDescription}`
                        update(
                            message,
                            {
                                pages: cloneArrayWithPatch(storyBoard.pages, { ...page, parts: newParts }, index)
                            }
                        )
                    }}
                    describeItem={(part, partIndex) => (
                        <PagePartControl key={partIndex} part={part} partIndex={partIndex} updatePart={updatePart} />
                    )}
                />

                <Box height={200} width={200}
                    display={'flex'}
                    flexDirection={'column'}
                    border={'1px dotted black'}
                >
                    <StoryPageDisplay page={page} />
                </Box>
            </Box>
        </EditorBox>
    )

}