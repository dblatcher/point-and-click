import { StoryPageDisplay } from "@/components/storyboard/StoryPageDisplay";
import { PagePicture, StoryBoard, StoryBoardPage } from "point-click-lib";
import { cloneArrayWithPatch } from "@/lib/clone";
import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import { ArrayControl } from "../ArrayControl";
import { ColorInput } from "../ColorInput";
import { makeEmptyStoryBoardPagePicture } from "../defaults";
import { DelayedStringInput } from "../DelayedStringInput";
import { EditorBox } from "../layout/EditorBox";
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
                    <Typography variant="h3">Text</Typography>
                    <Box gap={2} display={'flex'} flexDirection={'column'}>
                        <DelayedStringInput delayAfterEdits={5000}
                            label="title" 
                            value={page.title} 
                            inputHandler={title => updatePage(`title to "${title}"`, { title })
                        } />
                        <NarrativeEditor isRequired noDialog
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

                    <Typography variant="h3">Pictures</Typography>
                    <ArrayControl horizontalMoveButtons buttonSize={'small'} createButtonPlacement="END"
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
                    <StoryPageDisplay page={page} font={storyBoard.font} />
                </Box>
            </Box>
        </EditorBox>
    )

}