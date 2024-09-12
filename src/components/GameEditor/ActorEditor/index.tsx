import { SchemaForm } from "@/components/SchemaForm";
import { NumberInput, SelectInput, StringInput } from "@/components/SchemaForm/inputs";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { ActorData, Direction, Point } from "@/definitions";
import { ActorDataSchema, SoundValue } from "@/definitions/ActorData";
import { directions } from "@/definitions/SpriteSheet";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { ColorInput } from "../ColorInput";
import { EditorHeading } from "../EditorHeading";
import { InteractionsDialogsButton } from "../InteractionsDialogsButton";
import { ItemEditorHeaderControls } from "../ItemEditorHeaderControls";
import { SpritePreview } from "../SpritePreview";
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
    const { gameDesign, performUpdate } = useGameDesign()
    const [tabOpen, setTabOpen] = useState(ActorEditorTab.Details)
    const sprites = useSprites()

    const changeValue = (propery: keyof ActorData, newValue: unknown): void => {
        const modification: Partial<ActorData> = {}
        switch (propery) {
            case 'id':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue.toUpperCase()
                }
                break;
            case 'name':
            case 'room':
            case 'status':
            case 'filter':
            case 'dialogueColor':
                if (typeof newValue === 'string' || typeof newValue === 'undefined') {
                    modification[propery] = newValue
                }
                break;
            case 'direction':
                if (typeof newValue === 'string' && directions.includes(newValue as Direction)) {
                    modification[propery] = newValue as Direction
                }
                break;
            case 'width':
            case 'height':
            case 'x':
            case 'y':
            case 'speed':
            case 'baseline':
                if (typeof newValue === 'number') {
                    modification[propery] = newValue
                }
                break;
            case 'isPlayer':
            case 'noInteraction':
                if (typeof newValue === 'boolean' || typeof newValue === 'undefined') {
                    modification[propery] = newValue || undefined
                }
                break;
            case 'walkToX':
            case 'walkToY':
                if (typeof newValue === 'number' || typeof newValue === 'undefined') {
                    modification[propery] = newValue
                }
                break;
        }
        if (propery === 'id') {
            console.warn('ActorEditor tried to change id', { newValue })
            return
        }
        updateFromPartial(modification)
    }

    const updateFromPartial = (modification: Partial<ActorData>): void => {
        performUpdate('actors', {
            ...cloneData(data),
            ...modification,
        })
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

    const { sprite: spriteId, width = 1, height = 1, dialogueColor} = data
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
                <Tab label="Sprite" value={ActorEditorTab.Appearance} />
                <Tab label="Sound" value={ActorEditorTab.Sounds} />
                <Tab label="Start Position" value={ActorEditorTab.StartingPosition} />
            </Tabs>

            {tabOpen === ActorEditorTab.Details &&
                <Box maxWidth={'sm'}>
                    <SchemaForm
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
                            isPlayer: 'is player actor',
                            noInteraction: 'cannot interact with',
                        }}
                        data={data}
                        changeValue={(value, fieldDef) => {
                            changeValue(fieldDef.key as keyof ActorData, value)
                        }}
                    />
                    <InteractionsDialogsButton
                        criteria={(interaction) => interaction.targetId === data.id}
                        newPartial={{ targetId: data.id }}
                    />
                </Box>
            }
            {tabOpen === ActorEditorTab.Appearance &&
                <Stack direction={'row'} spacing={3}>
                    <Stack spacing={2}>
                        <SelectInput
                            value={spriteId}
                            options={listIds(sprites)}
                            label="pick sprite"
                            inputHandler={
                                id => updateFromPartial({ sprite: id })
                            }
                        />

                        <Stack direction={'row'} spacing={2}>
                            <NumberInput label="width" value={width}
                                inputHandler={(value) => changeValue('width', value)} />
                            <NumberInput label="height" value={height}
                                inputHandler={(value) => changeValue('height', value)} />
                        </Stack>

                        <StringInput
                            label="filter" value={data.filter || ''}
                            inputHandler={(value) => changeValue('filter', value)} />
                        <NumberInput
                            label="display baseline" value={data.baseline || 0}
                            min={0} max={data.height}
                            inputHandler={value => { changeValue('baseline', value) }} />
                        <ColorInput
                            label="dialogue color"
                            value={dialogueColor || ''}
                            setValue={value => {
                                changeValue('dialogueColor', value)
                            }} />
                    </Stack>
                    <SpritePreview data={data} />
                </Stack>
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
