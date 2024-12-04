import { StoryPageDisplay } from "@/components/storyboard/StoryPageDisplay";
import { PagePicture, StoryBoard, StoryBoardPage } from "@/definitions/StoryBoard";
import { cloneArrayWithPatch } from "@/lib/clone";
import { Box, Divider, Stack } from "@mui/material";
import React from "react";
import { StringInput } from "../../SchemaForm/StringInput";
import { ArrayControl } from "../ArrayControl";
import { ColorInput } from "../ColorInput";
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

    const updatePage = (message: string, mod: Partial<StoryBoardPage>) => {
        update(
            `change ${pageDescription} ${message}`,
            { pages: cloneArrayWithPatch(storyBoard.pages, mod, index) }
        )
    }

    return (
        <EditorBox title={pageDescription}>
            <Box display={'flex'} gap={4} justifyContent={'space-between'}>
                <Box>
                    <Box gap={1} display={'flex'} alignItems={'center'}>
                        <StringInput label="title" value={page.title} inputHandler={newTitle =>
                            updatePage(`title to "${newTitle}"`, { title: newTitle })
                        } />
                        <NarrativeEditor isRequired
                            narrative={page.narrative}
                            update={(narrative) => {
                                update(
                                    `change storyboard ${storyBoard.id} page #${index + 1} narrative`,
                                    { pages: cloneArrayWithPatch(storyBoard.pages, { narrative }, index) }
                                )
                            }} />
                    </Box>
                    <Stack gap={1} direction={'row'}>
                        <ColorInput
                            value={page.color}
                            label="text color"
                            setValue={(color) => updatePage(`text color to ${color}`, { color })}
                        />
                        <ColorInput
                            value={page.backgroundColor}
                            label="background color"
                            setValue={(backgroundColor) => updatePage(`background color to ${backgroundColor}`, { backgroundColor })}
                        />
                    </Stack>

                    <ArrayControl horizontalMoveButtons buttonSize={'small'} createButton="END"
                        stackProps={{ divider: <Divider /> }}
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
                <Box height={300} width={300}
                    display={'flex'}
                    flexDirection={'column'}
                    fontSize={10}
                >
                    <StoryPageDisplay page={page} />
                </Box>
            </Box>
        </EditorBox>
    )

}