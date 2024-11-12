import { StoryBoard } from "@/definitions/StoryBoard";
import { Stack } from "@mui/material";
import React from "react";
import { EditorHeading } from "./EditorHeading";
import { ItemEditorHeaderControls } from "./ItemEditorHeaderControls";

interface Props {
    storyBoard: StoryBoard
}

export const StoryBoardEditor: React.FunctionComponent<Props> = ({ storyBoard }) => {

    return <Stack spacing={2}>
        <EditorHeading heading="Story Board Editor" itemId={storyBoard.id} >
            <ItemEditorHeaderControls 
                dataItem={storyBoard} itemType='storyBoards' itemTypeName="story board"
            />
        </EditorHeading>
        <div>StoryBoardEditor: {storyBoard.id}</div>
    </Stack>
}