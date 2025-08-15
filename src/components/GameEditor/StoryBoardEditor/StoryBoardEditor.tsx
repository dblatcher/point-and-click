import { useGameDesign } from "@/context/game-design-context";
import { BoardFontSchema, BoardProgression, BoardProgressionSchema, StoryBoard } from "@/definitions/StoryBoard";
import { patchMember } from "@/lib/update-design";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { EditorHeading } from "../EditorHeading";
import { ItemEditorHeaderControls } from "../game-item-components/ItemEditorHeaderControls";
import { PageMenu } from "./PageMenu";

import { EditorBox } from "../EditorBox";
import { EnumSelectInput } from "../EnumSelectInput";
import { AmbientSoundControl } from "../RoomEditor/AmbientSoundControl";
import { BooleanInput } from "@/components/SchemaForm/BooleanInput";

interface Props {
    storyBoard: StoryBoard
}

const getProgressionDescription = (progression: BoardProgression | undefined): string => {
    switch (progression) {
        case 'buttons':
            return "There will be buttons on the screen allowing the user to go back and forwards at their own pace."
        case 'sound':
            return "The pages will be changed over the duration of the sound played, so the board is finished as the sound ends. Be sure to pick a sound file of a suitable length."
        case undefined:
            return "The board will stay up until the player clicks on the screen to go to the next page."
    }
}

export const StoryBoardEditor: React.FunctionComponent<Props> = ({ storyBoard }) => {
    const { applyModification, gameDesign } = useGameDesign()

    const update = (message: string, mod: Partial<StoryBoard>) => {
        return applyModification(
            message,
            { storyBoards: patchMember(storyBoard.id, mod, gameDesign.storyBoards) }
        )
    }

    return <Stack spacing={2}>
        <EditorHeading heading="Story Board Editor" itemId={storyBoard.id} >
            <ItemEditorHeaderControls
                dataItem={storyBoard} itemType='storyBoards' itemTypeName="story board"
            />
        </EditorHeading>

        <EditorBox title="Properties">
            <AmbientSoundControl
                label="sound"
                value={storyBoard.sound}
                setValue={(sound) => update(`set sound on storyboard ${storyBoard.id} `, { sound })} />
            <Box display={'flex'} alignItems={'center'} gap={2}>
                <EnumSelectInput
                    label="Progression mode"
                    notFullWidth
                    minWidth={120}
                    enumSchema={BoardProgressionSchema}
                    value={storyBoard.progression}
                    inputHandler={progression =>
                        update(`set progression on storyboard ${storyBoard.id} to ${progression}`, { progression })
                    }
                    inputUndefinedHandler={() =>
                        update(`unset progression on storyboard ${storyBoard.id}`, { progression: undefined })
                    } />

                <Typography> {getProgressionDescription(storyBoard.progression)}</Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'} gap={2}>
                <EnumSelectInput
                    label="Font"
                    notFullWidth
                    minWidth={120}
                    enumSchema={BoardFontSchema}
                    value={storyBoard.font}
                    inputHandler={font =>
                        update(`set font on storyboard ${storyBoard.id} to ${font}`, { font })
                    }
                    inputUndefinedHandler={() =>
                        update(`unset font on storyboard ${storyBoard.id}`, { font: undefined })
                    } />
                <Box border={1} padding={2} fontSize={'small'}>
                    <span style={{ fontFamily: storyBoard.font }}>abcdefghijklmnopqrstuvwxyz</span>
                </Box>
            </Box>
            <Box>
                <BooleanInput
                    label="is end of game"
                    value={storyBoard.isEndOfGame ?? false}
                    title="is end of game"
                    inputHandler={(isEndOfGame) => update(`set ${storyBoard.id} to ${isEndOfGame ? 'be' : 'not be'} the end of the game`, { isEndOfGame })} />
            </Box>
        </EditorBox>

        <PageMenu storyBoard={storyBoard} update={update} />
    </Stack>
}