import { StringInput } from "@/components/SchemaForm/StringInput";
import { useGameDesign } from "@/context/game-design-context";
import { RoomData } from "@/definitions";
import { NarrativeEditor } from "../NarrativeEditor";
import { Box, Typography } from "@mui/material";
import { HelpButton } from "../HelpButton";

type RoomEditorProps = {
    room: RoomData;
}

export const RoomDescriptionControl = ({ room }: RoomEditorProps) => {
    const { performUpdate } = useGameDesign()

    return <Box paddingY={5} display={'flex'} flexDirection={'column'} gap={10}>
        <StringInput optional
            label="room name"
            value={room.name ?? ''}
            inputHandler={(value) => {
                performUpdate('rooms', { ...room, name: value })
            }}
        />
        <Box>
            <Typography variant="h3">
                Narrative Description<HelpButton helpTopic="narrative" />
            </Typography>
            <NarrativeEditor narrative={room.narrative} noDialog update={(newNarrative) => {
                performUpdate('rooms', { ...room, narrative: newNarrative })
            }} />
        </Box>
    </Box>
}
