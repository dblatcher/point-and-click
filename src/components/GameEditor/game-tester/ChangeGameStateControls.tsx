import { useGameDesign } from "@/context/game-design-context"
import { getStatusSuggestions } from "@/lib/animationFunctions"
import { patchMember } from "@/lib/update-design"
import { findById } from "@/lib/util"
import { Box, Tab, Tabs } from "@mui/material"
import { useState } from "react"
import { StringInput } from "../../SchemaForm/StringInput"
import { DetailsAndStartPosition } from "../ActorEditor/DetailsAndStartPosition"
import { FlagMapControl } from "../FlagMapControl"
import { EditorBox } from "../layout/EditorBox"
import { StartingInventory } from "../StartingInventory"
import { ActorPositions } from "./ActorPositions"
import { StartConditionsAndLocation } from "./StartConditionsAndLocation"


export const ChangeGameStateControls = () => {
    const { gameDesign, applyModification } = useGameDesign();
    const [tabOpen, setTabOpen] = useState(0)
    const [actorId, setActorId] = useState<string | undefined>(() =>
        gameDesign.actors.find(actor => actor.isPlayer)?.id ?? gameDesign.actors[0]?.id
    )
    const actorToPosition = findById(actorId, gameDesign.actors)
    return (
        <>
            <Tabs value={tabOpen}
                onChange={(event, tabOpen) => setTabOpen(tabOpen)}
                scrollButtons="auto">
                <Tab label="Starting Conditions" value={0} />
                <Tab label="Actor Positions" value={1} />
                <Tab label="Flag and Items" value={2} />
            </Tabs>
            <Box display={'flex'} gap={2} marginTop={2}>
                {tabOpen === 0 && (<>
                    <StartConditionsAndLocation />
                </>)}
                {tabOpen === 1 && (<>
                    <ActorPositions actorId={actorId} setActorId={setActorId} />
                    {actorToPosition && (
                        <EditorBox>
                            <StringInput optional value={actorToPosition.status ?? ''} label="status"
                                suggestions={getStatusSuggestions(actorToPosition.id, gameDesign)}
                                inputHandler={(status) => applyModification(
                                    `set ${actorToPosition.id} status to ${status}`,
                                    { actors: patchMember(actorToPosition.id, { status }, gameDesign.actors) }
                                )}
                            />
                            <DetailsAndStartPosition actorData={actorToPosition}
                                defaultPreviewWidth={300}
                                updateFromPartial={(mod) => {
                                    applyModification(
                                        `move ${actorToPosition.id}`,
                                        { actors: patchMember(actorToPosition.id, mod, gameDesign.actors) }
                                    )
                                }}
                            />
                        </EditorBox>
                    )}
                </>)}
                {tabOpen === 2 && (<>
                    <EditorBox title="Flags">
                        <FlagMapControl forModifier />
                    </EditorBox>
                    <StartingInventory />
                </>)}
            </Box>
        </>
    )
}