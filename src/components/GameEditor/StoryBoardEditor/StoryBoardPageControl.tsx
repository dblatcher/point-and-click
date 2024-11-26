import { PagePicture, StoryBoard, StoryBoardPage } from "@/definitions/StoryBoard";
import { cloneArrayWithPatch } from "@/lib/clone";
import { Box } from "@mui/material";
import React from "react";
import { StringInput } from "../../SchemaForm/StringInput";
import { ArrayControl } from "../ArrayControl";
import { EditorBox } from "../EditorBox";
import { FramePickDialogButton } from "../FramePickDialogButton";
import { NarrativeEditor } from "../NarrativeEditor";
import { FramePreview } from "../SpriteEditor/FramePreview";
import { StoryPageDisplay } from "@/components/storyboard/StoryPageDisplay";
import { makeEmptyStoryBoardPagePicture } from "../defaults";

interface Props {
    storyBoard: StoryBoard
    page: StoryBoardPage
    index: number
    update: { (message: string, mod: Partial<StoryBoard>): void }
}

const PagePictureControl = ({
    picture,
    pictureIndex,
    updatePicture,
}: {
    picture: PagePicture
    pictureIndex: number,
    updatePicture: { (mod: Partial<PagePicture>, pictureIndex: number): void }

}) => {
    const { imageId, row = 0, col = 0 } = picture.image ?? {};

    const pickFrame = (row: number, col: number, imageId?: string) => {
        if (!imageId) {
            updatePicture({
                image: undefined
            }, pictureIndex)
            return
        }
        updatePicture({
            image: { row, col, imageId }
        }, pictureIndex)
    }


    return <Box padding={2} display={'flex'}>
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

    const updatePicture = (mod: Partial<PagePicture>, pictureIndex: number) => {
        const newPage: StoryBoardPage = {
            ...page,
            pictures: cloneArrayWithPatch(page.pictures, mod, pictureIndex)
        }
        update(
            `change ${pageDescription} picture #${pictureIndex}`,
            { pages: cloneArrayWithPatch(storyBoard.pages, newPage, index) }
        )
    }

    return (

        <EditorBox title={page.title}>
            <StringInput label="title" value={page.title} inputHandler={newTitle => {
                update(
                    `change storyboard ${storyBoard.id} page #${index + 1} to "${newTitle}"`,
                    { pages: cloneArrayWithPatch(storyBoard.pages, { title: newTitle }, index) }
                )
            }}
            />

            <NarrativeEditor
                narrative={page.narrative}
                update={(narrative) => {
                    update(
                        `change storyboard ${storyBoard.id} page #${index + 1} narrative`,
                        { pages: cloneArrayWithPatch(storyBoard.pages, { narrative }, index) }
                    )
                }} />

            <Box display={'flex'}>
                <ArrayControl horizontalMoveButtons buttonSize={'small'}
                    list={page.pictures}
                    mutateList={(newPictures) => {
                        const message = newPictures.length === page.pictures.length ? `change picture order in ${pageDescription}` : `delete picture from ${pageDescription}`
                        update(
                            message,
                            {
                                pages: cloneArrayWithPatch(storyBoard.pages, { ...page, pictures: newPictures }, index)
                            }
                        )
                    }}
                    describeItem={(picture, pictureIndex) => (
                        <PagePictureControl key={pictureIndex} picture={picture} pictureIndex={pictureIndex} updatePicture={updatePicture} />
                    )}
                    createItem={makeEmptyStoryBoardPagePicture}
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