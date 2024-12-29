import { SchemaForm } from "@/components/SchemaForm";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { ActorData } from "@/definitions";
import { ActorDataSchema, SoundValue } from "@/definitions/ActorData";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { cloneData } from "@/lib/clone";
import { patchMember } from "@/lib/update-design";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { ColorInput } from "../ColorInput";
import { EditorHeading } from "../EditorHeading";
import { InteractionsDialogsButton } from "../InteractionsDialogsButton";
import { ItemEditorHeaderControls } from "../ItemEditorHeaderControls";
import { ActorAppearanceControl } from "./ActorAppearanceControl";
import { AnimationSounds } from "./AnimationSounds";
import { PositionPreview } from "./PositionPreview";


type Props = {
    data: ActorData;
}

enum ActorEditorTab {
    Details,
    Appearance,
    Sounds,
    StartingPosition,
}

export const ActorEditor = ({ data }: Props) => {
    const { gameDesign, applyModification } = useGameDesign()
    const [tabOpen, setTabOpen] = useState(ActorEditorTab.Details)
    const sprites = useSprites()

    const updateFromPartial = (input: Partial<ActorData>, description?: string) => {
        applyModification(
            description ?? `update Actor "${data.id}"`,
            { actors: patchMember(data.id, input, gameDesign.actors) }
        )
    }

    const changeSoundMap = (key: string, value?: SoundValue[]): void => {
        const makeMod = (): Partial<ActorData> => {
            const { soundEffectMap = {} } = cloneData(data)
            if (typeof value === 'undefined') {
                delete soundEffectMap[key]
            } else {
                soundEffectMap[key] = value
            }
            return { soundEffectMap }
        }

        updateFromPartial(makeMod())
    }

    const { sprite: spriteId, width = 1, height = 1, dialogueColor } = data
    const spriteData = sprites.find(sprite => sprite.id === spriteId)?.data
    const statusSuggestions = getStatusSuggestions(data.id, {
        sprites: spriteData ? [spriteData] : [],
        actors: [data]
    })


    return (
        <Stack component='article' spacing={1}>
            <EditorHeading heading="Actor Editor" itemId={data.id} >
                <ItemEditorHeaderControls
                    dataItem={data}
                    itemType="actors"
                    itemTypeName="actor"
                />
            </EditorHeading>

            <Tabs value={tabOpen} onChange={(_, tabOpen) => setTabOpen(tabOpen)}>
                <Tab label="Details" value={ActorEditorTab.Details} />
                <Tab label="Images" value={ActorEditorTab.Appearance} />
                <Tab label="Sound" value={ActorEditorTab.Sounds} />
                <Tab label="Start Position" value={ActorEditorTab.StartingPosition} />
            </Tabs>

            {tabOpen === ActorEditorTab.Details &&
                <Box maxWidth={'sm'}>
                    <SchemaForm
                        textInputDelay={2000}
                        schema={ActorDataSchema.pick({
                            name: true,
                            status: true,
                            isPlayer: true,
                            speed: true,
                            noInteraction: true,
                        })}
                        suggestions={{
                            status: statusSuggestions,
                        }}
                        fieldAliases={{
                            speed: 'movement speed',
                            status: 'initial status',
                            isPlayer: 'is player actor',
                            noInteraction: 'cannot interact with',
                        }}
                        data={data}
                        changeValue={(newValue, fieldDef) => {
                            if (fieldDef.key === 'id') {
                                console.warn('ActorEditor tried to change id', { newValue })
                                return
                            }
                            const modParse = ActorDataSchema.partial().safeParse({ [fieldDef.key]: newValue })
                            if (!modParse.success) {
                                console.warn('ActorEditor got invalid modification', modParse.error.issues)
                                return
                            }
                            return updateFromPartial(modParse.data)
                        }}
                    />

                    <ColorInput
                        label="dialogue color"
                        value={data.dialogueColor || ''}
                        setValue={dialogueColor => {
                            updateFromPartial({ dialogueColor })
                        }} />
                    <InteractionsDialogsButton
                        criteria={(interaction) => interaction.targetId === data.id}
                        newPartial={{ targetId: data.id }}
                    />
                </Box>
            }
            {tabOpen === ActorEditorTab.Appearance &&
                <ActorAppearanceControl data={data} />
            }
            {tabOpen === ActorEditorTab.Sounds &&
                <AnimationSounds
                    actor={data}
                    changeSoundMap={changeSoundMap} />
            }
            {tabOpen === ActorEditorTab.StartingPosition &&
                <PositionPreview
                    updateFromPartial={updateFromPartial}
                    actorData={data} />
            }
        </Stack>
    )
}
