import { useGameDesign } from "@/context/game-design-context";
import { StoryBoard } from "@/definitions/StoryBoard";
import { patchMember } from "@/lib/update-design";
import { Stack } from "@mui/material";
import React from "react";
import { EditorHeading } from "../EditorHeading";
import { ItemEditorHeaderControls } from "../ItemEditorHeaderControls";
import { PageMenu } from "./PageMenu";

interface Props {
    storyBoard: StoryBoard
}

export const StoryBoardEditor: React.FunctionComponent<Props> = ({ storyBoard }) => {
    const { applyModification, gameDesign } = useGameDesign()

    const update = (message: string, mod: Partial<StoryBoard>) => {
        return applyModification(
            message,
            { storyBoards: patchMember(storyBoard.id, mod, gameDesign.storyBoards ?? []) }
        )
    }

    return <Stack spacing={2}>
        <EditorHeading heading="Story Board Editor" itemId={storyBoard.id} >
            <ItemEditorHeaderControls
                dataItem={storyBoard} itemType='storyBoards' itemTypeName="story board"
            />
        </EditorHeading>
        <PageMenu storyBoard={storyBoard} update={update} />
    </Stack>
}