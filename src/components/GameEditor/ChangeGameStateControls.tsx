import { Box, Dialog, DialogContent, DialogTitle } from "@mui/material"
import { ActorPositions } from "./ActorPositions"
import { EditorBox } from "./EditorBox"
import { FlagMapControl } from "./FlagMapControl"
import { StartingConditionsForm } from "./StartingConditionsForm"
import { StartingInventory } from "./StartingInventory"
import { useGameDesign } from "@/context/game-design-context"
import { findById } from "@/lib/util"
import { useState } from "react"
import { getStatusSuggestions } from "@/lib/animationFunctions"
import { patchMember } from "@/lib/update-design"
import { StringInput } from "../SchemaForm/StringInput"
import { PositionPreview } from "./ActorEditor/PositionPreview"


export const ChangeGameStateControls = () => {

    const { gameDesign, applyModification } = useGameDesign();
    const [actorId, setActorId] = useState<string | undefined>(undefined)
    const actorToPosition = findById(actorId, gameDesign.actors)

    return (
        <Box display={'flex'} gap={2} >

            <ActorPositions actorId={actorId} setActorId={setActorId} />
            {actorToPosition ? (
                <EditorBox>
                    <StringInput optional value={actorToPosition.status ?? ''} label="status"
                        suggestions={getStatusSuggestions(actorToPosition.id, gameDesign)}
                        inputHandler={(status) => applyModification(
                            `set ${actorToPosition.id} status to ${status}`,
                            { actors: patchMember(actorToPosition.id, { status }, gameDesign.actors) }
                        )}
                    />
                    <PositionPreview actorData={actorToPosition}
                        defaultPreviewWidth={250}
                        updateFromPartial={(mod) => {
                            applyModification(
                                `move ${actorToPosition.id}`,
                                { actors: patchMember(actorToPosition.id, mod, gameDesign.actors) }
                            )
                        }}
                    />
                </EditorBox>
            ) : (
                <>
                    <StartingConditionsForm />
                    <EditorBox title="Flags">
                        <FlagMapControl forModifier />
                    </EditorBox>
                    <StartingInventory />
                </>
            )}
        </Box>
    )
}