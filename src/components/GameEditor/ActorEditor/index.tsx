import { SchemaForm } from "@/components/SchemaForm";
import { NumberInput, OptionalNumberInput, SelectInput, StringInput } from "@/components/SchemaForm/inputs";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { ActorData, Direction, Point } from "@/definitions";
import { ActorDataSchema, SoundValue } from "@/definitions/ActorData";
import { directions } from "@/definitions/SpriteSheet";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { cloneData } from "@/lib/clone";
import { listIds } from "@/lib/util";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { AccoridanedContent } from "../AccordianedContent";
import { ColorInput } from "../ColorInput";
import { EditorHeading } from "../EditorHeading";
import { ItemEditorHeaderControls } from "../ItemEditorHeaderControls";
import { RecordEditor } from "../RecordEditor";
import { SpritePreview } from "../SpritePreview";
import { PositionPreview } from "./PositionPreview";
import { SoundValueForm } from "./SoundValueForm";
import { InteractionsDialogsButton } from "../InteractionsDialogsButton";


type Props = {
    data: ActorData;
}

const newSound = (): SoundValue => ({ soundId: "beep" })

export const ActorEditor = (props: Props) => {
    const { gameDesign, performUpdate } = useGameDesign()
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
            ...cloneData(props.data),
            ...modification,
        })
    }

    const changeSoundMap = (key: string, value?: SoundValue): void => {
        const makeMod = (): Partial<ActorData> => {
            const { soundEffectMap = {} } = cloneData(props.data)
            if (typeof value === 'undefined') {
                delete soundEffectMap[key]
            } else {
                soundEffectMap[key] = value
            }
            return { soundEffectMap }
        }

        updateFromPartial(makeMod())
    }

    const handlePreviewClick = (point: Point, pointRole: 'position' | 'walkTo') => {
        switch (pointRole) {
            case 'position':
                return updateFromPartial(point)
            case 'walkTo': {
                const { x, y } = props.data;
                const walkToX = point.x - x
                const walkToY = point.y - y
                return updateFromPartial({ walkToX, walkToY })
            }
        }
    }


    const actor = props.data
    const { sprite: spriteId, width = 1, height = 1, soundEffectMap = {}, walkToX, walkToY, dialogueColor, room, x, y, direction } = actor
    const spriteData = sprites.find(sprite => sprite.id === spriteId)?.data
    const statusSuggestions = getStatusSuggestions(props.data.id, {
        sprites: spriteData ? [spriteData] : [],
        actors: [actor]
    })


    return (
        <Stack component='article' spacing={1}>
            <EditorHeading heading="Actor Editor" itemId={props.data.id} >
                <ItemEditorHeaderControls
                    dataItem={actor}
                    itemType="actors"
                    itemTypeName="actor"
                />
            </EditorHeading>

            <Grid container flexWrap={'nowrap'} spacing={1}>
                <Grid item xs={5}><>
                    <AccoridanedContent tabs={[
                        {
                            label: 'Actor', content: <Box maxWidth={'sm'}>
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
                                    data={props.data}
                                    changeValue={(value, fieldDef) => {
                                        changeValue(fieldDef.key as keyof ActorData, value)
                                    }}
                                />

                                <ColorInput
                                    label="dialogue color"
                                    value={dialogueColor || ''}
                                    setValue={value => {
                                        changeValue('dialogueColor', value)
                                    }} />

                                <InteractionsDialogsButton
                                    criteria={(interaction) => interaction.targetId === props.data.id}
                                    newPartial={{ targetId: props.data.id }}
                                />
                            </Box>
                        },
                        {
                            label: 'sprite', content: (
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
                                            label="filter" value={props.data.filter || ''}
                                            inputHandler={(value) => changeValue('filter', value)} />
                                        <NumberInput
                                            label="display baseline" value={props.data.baseline || 0}
                                            min={0} max={props.data.height}
                                            inputHandler={value => { changeValue('baseline', value) }} />
                                    </Stack>
                                    <SpritePreview data={actor} />
                                </Stack>
                            )
                        },
                        {
                            label: 'sounds',
                            content: (
                                <>
                                    {soundEffectMap && (
                                        <RecordEditor
                                            record={soundEffectMap}
                                            addEntryLabel={'Pick animation to add sound effect for'}
                                            describeValue={(key, value) =>
                                                <SoundValueForm
                                                    animation={key}
                                                    data={value}
                                                    updateData={(data) => { changeSoundMap(key, data) }}
                                                />
                                            }
                                            setEntry={(key, value) => { changeSoundMap(key, value) }}
                                            addEntry={(key) => { changeSoundMap(key, newSound()) }}
                                            newKeySuggestions={statusSuggestions}
                                        />
                                    )}
                                </>
                            )
                        },
                        {
                            label: 'position', content: (
                                <Stack spacing={2}>
                                    <SelectInput label="roomId"
                                        options={listIds(gameDesign.rooms)}
                                        value={room || ''}
                                        optional={true}
                                        inputHandler={roomId => { changeValue('room', roomId) }} />
                                    <Stack direction={'row'} spacing={2} maxWidth={300}>
                                        <NumberInput
                                            label="x" value={x}
                                            inputHandler={value => { changeValue('x', value) }} />
                                        <NumberInput
                                            label="y" value={y}
                                            inputHandler={value => { changeValue('y', value) }} />
                                        <SelectInput label="direction"
                                            value={direction || 'left'}
                                            options={directions}
                                            inputHandler={(item) => { changeValue('direction', item) }} />
                                    </Stack>

                                    <Stack direction={'row'} spacing={2}>
                                        <Typography variant="caption">walk to point</Typography>
                                        <OptionalNumberInput
                                            value={walkToX} label="X: "
                                            inputHandler={value => { changeValue('walkToX', value) }} />
                                        <OptionalNumberInput
                                            value={walkToY} label="Y: "
                                            inputHandler={value => { changeValue('walkToY', value) }} />
                                    </Stack>
                                </Stack>
                            )
                        },
                    ]} />
                </>
                </Grid>
                <Grid item flex={1}>
                    <div style={{ position: 'sticky', top: 1 }}>
                        <PositionPreview
                            actorData={props.data}
                            reportClick={handlePreviewClick}
                            pickRoom={(roomId) => changeValue('room', roomId)}
                        />
                    </div>
                </Grid>
            </Grid>
        </Stack>
    )
}
