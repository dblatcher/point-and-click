import { StoryBoard, StoryBoardPage } from "@/definitions/StoryBoard";
import { cloneData } from "@/lib/clone";
import { Box } from "@mui/material";
import React from "react";
import { StringInput } from "../SchemaForm/StringInput";
import { EditorBox } from "./EditorBox";

interface Props {
    storyBoard: StoryBoard
    page: StoryBoardPage
    index: number
    isOpen: { (index: number): boolean }
    update: { (message: string, mod: Partial<StoryBoard>): void }
    openPage: { (index: number): void }
    closePage: { (index: number): void }
}

export const StoryBoardPageControl: React.FunctionComponent<Props> = ({
    storyBoard, page, index, isOpen, update, openPage, closePage
}) => {

    return (

        <EditorBox title={page.title}>
            <Box>

                {isOpen(index) ? (
                    <button onClick={() => { closePage(index) }}>close</button>

                ) : (
                    <button onClick={() => { openPage(index) }}>open</button>
                )}
            </Box>
            {isOpen(index) && (

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
            )}
        </EditorBox>
    )

}