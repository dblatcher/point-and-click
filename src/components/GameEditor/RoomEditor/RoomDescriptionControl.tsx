import { StringInput } from "@/components/SchemaForm/StringInput";
import { useGameDesign } from "@/context/game-design-context";
import { RoomData } from "@/definitions";
import { NarrativeEditor } from "../NarrativeEditor";
import { Box, Typography } from "@mui/material";
import { HelpButton } from "../HelpButton";
import { AmbiantSoundControl } from "./AmbiantSoundControl";

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
        <AmbiantSoundControl label="background music"
            value={room.backgroundMusic}
            setValue={(backgroundMusic) => {
                modifyRoom('Set background music', room.id, { backgroundMusic })
            }}
        />
        <AmbiantSoundControl label="ambiant Noise"
            value={room.ambiantNoise}
            setValue={(ambiantNoise) => {
                modifyRoom('Set ambiant noise', room.id, { ambiantNoise })
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
