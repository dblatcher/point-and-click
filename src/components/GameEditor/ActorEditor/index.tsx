import { useGameDesign } from "@/context/game-design-context";
import { ActorData } from "@/definitions";
import { SoundValue } from "@/definitions/ActorData";
import { cloneData } from "@/lib/clone";
import { patchMember } from "@/lib/update-design";
import { Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { ItemEditorHeaderControls } from "../game-item-components/ItemEditorHeaderControls";
import { EditorHeading } from "../layout/EditorHeading";
import { ActorAppearanceControl } from "./ActorAppearanceControl";
import { AnimationSounds } from "./AnimationSounds";
import { DetailsAndStartPosition } from "./DetailsAndStartPosition";


type Props = {
    actorData: ActorData;
}

enum ActorEditorTab {
    Details,
    Appearance,
    Sounds,
}

export const ActorEditor = ({ actorData }: Props) => {
    const { gameDesign, applyModification } = useGameDesign()
    const [tabOpen, setTabOpen] = useState(ActorEditorTab.Details)

    const updateFromPartial = (input: Partial<ActorData>, description?: string) => {
        applyModification(
            description ?? `update Actor "${actorData.id}"`,
            { actors: patchMember(actorData.id, input, gameDesign.actors) }
        )
    }

    const changeSoundMap = (key: string, value?: SoundValue[]): void => {
        const makeMod = (): Partial<ActorData> => {
            const { soundEffectMap = {} } = cloneData(actorData)
            if (typeof value === 'undefined') {
                delete soundEffectMap[key]
            } else {
                soundEffectMap[key] = value
            }
            return { soundEffectMap }
        }
        updateFromPartial(makeMod())
    }


    return (
        <Stack component='article' spacing={1}>
            <EditorHeading heading="Actor Editor" itemId={actorData.id} >
                <ItemEditorHeaderControls
                    dataItem={actorData}
                    itemType="actors"
                    itemTypeName="actor"
                />
            </EditorHeading>

            <Tabs value={tabOpen} onChange={(_, tabOpen) => setTabOpen(tabOpen)}>
                <Tab label="Details" value={ActorEditorTab.Details} />
                <Tab label="Images" value={ActorEditorTab.Appearance} />
                <Tab label="Sound" value={ActorEditorTab.Sounds} />
            </Tabs>

            {tabOpen === ActorEditorTab.Details &&
                <DetailsAndStartPosition actorData={actorData} updateFromPartial={updateFromPartial} />
            }
            {tabOpen === ActorEditorTab.Appearance &&
                <ActorAppearanceControl data={actorData} />
            }
            {tabOpen === ActorEditorTab.Sounds &&
                <AnimationSounds actor={actorData} changeSoundMap={changeSoundMap} />
            }
        </Stack>
    )
}
