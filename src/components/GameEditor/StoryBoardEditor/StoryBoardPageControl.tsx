import { StoryPageDisplay } from "@/components/storyboard/StoryPageDisplay";
import { PagePicture, StoryBoard, StoryBoardPage } from "@/definitions/StoryBoard";
import { cloneArrayWithPatch } from "@/lib/clone";
import { Box } from "@mui/material";
import React from "react";
import { StringInput } from "../../SchemaForm/StringInput";
import { ArrayControl } from "../ArrayControl";
import { makeEmptyStoryBoardPagePicture } from "../defaults";
import { EditorBox } from "../EditorBox";
import { NarrativeEditor } from "../NarrativeEditor";
import { PagePictureControl } from "./PagePictureControl";

interface Props {
    storyBoard: StoryBoard
    page: StoryBoardPage
    index: number
    update: { (message: string, mod: Partial<StoryBoard>): void }
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
        <EditorBox title={pageDescription}>
            <Box display={'flex'} gap={4}>
                <Box>
                    <StringInput label="title" value={page.title} inputHandler={newTitle => {
                        update(
                            `change storyboard ${storyBoard.id} page #${index + 1} to "${newTitle}"`,
                            { pages: cloneArrayWithPatch(storyBoard.pages, { title: newTitle }, index) }
                        )
                    }} />

                    <NarrativeEditor isRequired
                        narrative={page.narrative}
                        update={(narrative) => {
                            update(
                                `change storyboard ${storyBoard.id} page #${index + 1} narrative`,
                                { pages: cloneArrayWithPatch(storyBoard.pages, { narrative }, index) }
                            )
                        }} />

                    <ArrayControl horizontalMoveButtons buttonSize={'small'}
                        list={page.pictures}
                        mutateList={(newPictures) => {
                            update(
                                newPictures.length === page.pictures.length ? `change picture order in ${pageDescription}` : `delete picture from ${pageDescription}`,
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
                </Box>
                <Box height={200} width={200}
                    display={'flex'}
                    flexDirection={'column'}
                    border={'1px dotted black'}
                    fontSize={8}
                >
                    <StoryPageDisplay page={page} />
                </Box>
            </Box>
        </EditorBox>
    )

}