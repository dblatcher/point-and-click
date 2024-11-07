import { StringInput } from "@/components/SchemaForm/StringInput";
import { useGameDesign } from "@/context/game-design-context";
import { RoomData } from "@/definitions";
import { NarrativeEditor } from "../NarrativeEditor";
import { Box, Typography } from "@mui/material";
import { HelpButton } from "../HelpButton";
import { AmbientSoundControl } from "./AmbientSoundControl";

type RoomEditorProps = {
    room: RoomData;
}

export const RoomDescriptionControl = ({ room }: RoomEditorProps) => {
    const { modifyRoom } = useGameDesign()

    return <Box paddingY={5} display={'flex'} flexDirection={'column'} gap={10}>
        <StringInput optional
            label="room name"
            value={room.name ?? ''}
            inputHandler={(name) => {
                modifyRoom(`change name, room ${room.id}`, room.id, { name })
            }}
        />
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
        <Box>
            <Typography variant="h3">
                Narrative Description<HelpButton helpTopic="narrative" />
            </Typography>
            <NarrativeEditor narrative={room.narrative} noDialog update={(narrative) => {
                modifyRoom(`change narrative, room ${room.id}`, room.id, { narrative })
            }} />
        </Box>
    </Box>
}
