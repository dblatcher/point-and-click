import { Box } from "@mui/material"
import { ActorPositions } from "./ActorPositions"
import { EditorBox } from "./EditorBox"
import { FlagMapControl } from "./FlagMapControl"
import { StartingConditionsForm } from "./StartingConditionsForm"
import { StartingInventory } from "./StartingInventory"


export const ChangeGameStateControls = () => {

    return (
        <Box display={'flex'} gap={2}>
            <StartingConditionsForm />
            <EditorBox title="Flags">
                <FlagMapControl forModifier />
            </EditorBox>
            <StartingInventory />
            <ActorPositions />
        </Box>
    )
}