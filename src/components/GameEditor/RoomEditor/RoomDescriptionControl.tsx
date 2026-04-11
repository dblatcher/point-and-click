import { useGameDesign } from "@/context/game-design-context";
import { Box, Typography } from "@mui/material";
import { RoomData } from "point-click-lib";
import { DelayedStringInput } from "../DelayedStringInput";
import { HelpButton } from "../HelpButton";
import { LayoutControls, LayoutHolder, LayoutPreview } from "../layout/SplitLayout";
import { NarrativeEditor } from "../NarrativeEditor";
import { AmbientSoundControl } from "./AmbientSoundControl";
import { Preview } from "./Preview";

type RoomEditorProps = {
    room: RoomData;
}

export const RoomDescriptionControl = ({ room }: RoomEditorProps) => {
    const { modifyRoom, gameDesign } = useGameDesign()

    return <LayoutHolder>
        <LayoutControls>
            <DelayedStringInput optional delayAfterEdits={5000}
                label="room name"
                value={room.name ?? ''}
                inputHandler={(name) => {
                    modifyRoom(`change name, room ${room.id}`, room.id, { name })
                }}
            />
            <Box component={'section'}>
                <Typography variant="h3">
                    Sounds <HelpButton helpTopic="room sounds" />
                </Typography>
                <AmbientSoundControl label="background music"
                    value={room.backgroundMusic}
                    setValue={(backgroundMusic) => {
                        modifyRoom('Set background music', room.id, { backgroundMusic })
                    }}
                />
                <AmbientSoundControl label="ambient Noise"
                    value={room.ambientNoise}
                    setValue={(ambientNoise) => {
                        modifyRoom('Set ambient noise', room.id, { ambientNoise })
                    }}
                />
            </Box>
            <Box component={'section'}>
                <Typography variant="h3">
                    Narrative Description<HelpButton helpTopic="narrative" />
                </Typography>
                <NarrativeEditor narrative={room.narrative} noDialog update={(narrative) => {
                    modifyRoom(`change narrative, room ${room.id}`, room.id, { narrative })
                }} />
            </Box>
        </LayoutControls>
        <LayoutPreview>
            <Preview roomData={room} actors={gameDesign.actors} />
        </LayoutPreview>
    </LayoutHolder>

}
