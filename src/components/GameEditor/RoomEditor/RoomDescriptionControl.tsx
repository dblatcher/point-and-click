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
    const { modifyRoom } = useGameDesign()

    return <Box paddingY={5} display={'flex'} flexDirection={'column'} gap={10}>
        <StringInput optional
            label="room name"
            value={room.name ?? ''}
            inputHandler={(name) => {
                modifyRoom(`change name, room ${room.id}`, room.id, {name})
            }}
        />
        <Box>
            <Typography variant="h3">
                Narrative Description<HelpButton helpTopic="narrative" />
            </Typography>
            <NarrativeEditor narrative={room.narrative} noDialog update={(narrative) => {
                modifyRoom(`change narrative, room ${room.id}`, room.id, {narrative})
            }} />
        </Box>
    </Box>
}
