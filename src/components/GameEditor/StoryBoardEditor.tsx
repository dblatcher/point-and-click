import { useGameDesign } from "@/context/game-design-context";
import { StoryBoard } from "@/definitions/StoryBoard";
import { cloneData } from "@/lib/clone";
import { patchMember } from "@/lib/update-design";
import { Box, Stack } from "@mui/material";
import React from "react";
import { StringInput } from "../SchemaForm/StringInput";
import { ArrayControl } from "./ArrayControl";
import { EditorHeading } from "./EditorHeading";
import { ItemEditorHeaderControls } from "./ItemEditorHeaderControls";

interface Props {
    storyBoard: StoryBoard
}

export const StoryBoardEditor: React.FunctionComponent<Props> = ({ storyBoard }) => {
    const { applyModification, gameDesign } = useGameDesign()

    return <Stack spacing={2}>
        <EditorHeading heading="Story Board Editor" itemId={storyBoard.id} >
            <ItemEditorHeaderControls
                dataItem={storyBoard} itemType='storyBoards' itemTypeName="story board"
            />
        </EditorHeading>

        <ArrayControl
            list={storyBoard.pages}
            createItem={() => ({ title: '' })}
            describeItem={(page, index) => (
                <Box>
                    <StringInput label="title" value={page.title} inputHandler={newTitle => {
                        const newPages = cloneData(storyBoard.pages)
                        const pageToEdit = newPages[index]
                        if (pageToEdit) {
                            pageToEdit.title = newTitle
                        }

                        applyModification(
                            `change storyboard ${storyBoard.id} page #${index + 1} to "${newTitle}"`,
                            { storyBoards: patchMember(storyBoard.id, { pages: newPages }, gameDesign.storyBoards ?? []) }
                        )
                    }}
                    />
                </Box>
            )}
            mutateList={(pages) => {
                applyModification(
                    `change storyboard ${storyBoard.id}`,
                    { storyBoards: patchMember(storyBoard.id, { pages }, gameDesign.storyBoards ?? []) }
                )
            }}
        />

    </Stack>
}