import { SchemaForm } from "@/components/SchemaForm";
import { NumberInput, OptionalNumberInput, SelectInput, StringInput } from "@/components/SchemaForm/inputs";
import { ActorData, Direction, Point, RoomData } from "@/definitions";
import { ActorDataSchema, SoundValue } from "@/definitions/ActorData";
import { directions } from "@/definitions/SpriteSheet";
import type { Sprite } from "@/lib/Sprite";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { cloneData } from "@/lib/clone";
import { downloadJsonFile, uploadJsonData } from "@/lib/files";
import { listIds } from "@/lib/util";
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { Component } from "react";
import { AccoridanedContent } from "../AccordianedContent";
import { DeleteDataItemButton } from "../DeleteDataItemButton";
import { EditorHeading } from "../EditorHeading";
import { RecordEditor } from "../RecordEditor";
import { SpritePreview } from "../SpritePreview";
import { PositionPreview } from "./PositionPreview";
import { SoundValueForm } from "./SoundValueForm";


type State = { sprite: string | undefined };

type Props = {
    data: ActorData;
    updateData: (data: ActorData) => void;
    rooms: RoomData[];
    provideSprite: { (id: string): Sprite | undefined }
    spriteIds: string[];
}

const newSound = (): SoundValue => ({ soundId: "beep" })

export class ActorEditor extends Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.handleLoadButton = this.handleLoadButton.bind(this)
        this.handlePreviewClick = this.handlePreviewClick.bind(this)
        this.changeValue = this.changeValue.bind(this)
        this.changeSoundMap = this.changeSoundMap.bind(this)
    }

    changeValue(propery: keyof ActorData, newValue: unknown) {
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
        this.updateFromPartial(modification)
    }

    updateFromPartial(modification: Partial<ActorData>) {
        this.props.updateData({
            ...cloneData(this.props.data),
            ...modification,
            dialogueColor: undefined,
        })
    }

    changeSoundMap(key: string, value?: SoundValue): void {
        const makeMod = (): Partial<ActorData> => {
            const { soundEffectMap = {} } = cloneData(this.props.data)
            if (typeof value === 'undefined') {
                delete soundEffectMap[key]
            } else {
                soundEffectMap[key] = value
            }
            return { soundEffectMap }
        }

        this.updateFromPartial(makeMod())
    }
    handleLoadButton = async () => {
        const { data, error } = await uploadJsonData(ActorDataSchema)
        if (data) {
            this.setState(data)
        } else {
            console.warn("NOT ACTOR DATA", error)
        }
    }
    handlePreviewClick(point: Point, pointRole: 'position' | 'walkTo') {
        switch (pointRole) {
            case 'position':
                return this.updateFromPartial(point)
            case 'walkTo': {
                const { x, y } = this.props.data;
                const walkToX = point.x - x
                const walkToY = point.y - y
                return this.updateFromPartial({ walkToX, walkToY })
            }
        }
    }

    get previewData(): ActorData {
        return {
            ...this.props.data,
            x: this.props.data.width / 2, y: 0
        }
    }

    get statusSuggestions(): string[] {
        const { sprite: spriteId, id } = this.props.data
        const { provideSprite } = this.props
        const sprite = provideSprite(spriteId)
        const sprites = sprite ? [sprite.data] : []
        return getStatusSuggestions(id, {
            sprites,
            actors: [this.props.data]
        })
    }

    render() {
        const { changeValue } = this
        const actor = this.props.data
        const { sprite: spriteId, width = 1, height = 1, soundEffectMap = {}, walkToX, walkToY, dialogueColor, room, x, y, direction } = this.props.data
        const { spriteIds } = this.props

        return (
            <Stack component='article' spacing={1}>
                <EditorHeading heading="Actor Editor" itemId={this.props.data.id} />
                <Grid container flexWrap={'nowrap'} spacing={1}>
                    <Grid item xs={5}><>
                        <AccoridanedContent tabs={[
                            {
                                label: 'Actor', content: <Box maxWidth={'sm'}>
                                    <SchemaForm
                                        schema={ActorDataSchema.pick({
                                            id: true,
                                            name: true,
                                            status: true,
                                            isPlayer: true,
                                            speed: true,
                                            noInteraction: true,
                                        })}
                                        suggestions={{
                                            status: this.statusSuggestions,
                                        }}
                                        fieldAliases={{
                                            speed: 'movement speed',
                                            isPlayer: 'is player actor',
                                            noInteraction: 'cannot interact with',
                                        }}
                                        data={this.props.data}
                                        changeValue={(value, fieldDef) => {
                                            changeValue(fieldDef.key as keyof ActorData, value)
                                        }}
                                    />

                                    <StringInput
                                        type="color"
                                        label="dialogue color"
                                        value={dialogueColor || ''}
                                        inputHandler={value => { changeValue('dialogueColor', value) }} />
                                </Box>
                            },
                            {
                                label: 'sprite', content: (
                                    <Stack direction={'row'} spacing={3}>
                                        <Stack spacing={2}>

                                            <SelectInput
                                                value={spriteId}
                                                options={spriteIds}
                                                label="pick sprite"
                                                inputHandler={
                                                    id => this.updateFromPartial({ sprite: id })
                                                }
                                            />

                                            <Stack direction={'row'} spacing={2}>
                                                <NumberInput label="width" value={width}
                                                    inputHandler={(value) => changeValue('width', value)} />
                                                <NumberInput label="height" value={height}
                                                    inputHandler={(value) => changeValue('height', value)} />
                                            </Stack>

                                            <StringInput
                                                label="filter" value={this.props.data.filter || ''}
                                                inputHandler={(value) => changeValue('filter', value)} />
                                            <NumberInput
                                                label="display baseline" value={this.props.data.baseline || 0}
                                                min={0} max={this.props.data.height}
                                                inputHandler={value => { changeValue('baseline', value) }} />
                                        </Stack>
                                        <SpritePreview data={this.previewData} />
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
                                                        updateData={(data) => { this.changeSoundMap(key, data) }}
                                                    />
                                                }
                                                setEntry={(key, value) => { this.changeSoundMap(key, value) }}
                                                addEntry={(key) => { this.changeSoundMap(key, newSound()) }}
                                                newKeySuggestions={this.statusSuggestions}
                                            />
                                        )}
                                    </>
                                )
                            },
                            {
                                label: 'position', content: (
                                    <Stack spacing={2}>
                                        <SelectInput label="roomId"
                                            options={listIds(this.props.rooms)}
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
                            {
                                label: 'storage', content: (
                                    <>
                                        <DeleteDataItemButton
                                            dataItem={actor}
                                            itemType="actors"
                                            itemTypeName="actor"
                                        />
                                        <Button
                                            startIcon={<DownloadIcon />}
                                            onClick={(): void => { downloadJsonFile(actor, 'actor') }}
                                        >Save to file</Button>
                                    </>
                                )
                            }
                        ]} />
                    </>
                    </Grid>
                    <Grid item flex={1}>
                        <div style={{ position: 'sticky', top: 1 }}>
                            <PositionPreview
                                actorData={this.props.data}
                                reportClick={this.handlePreviewClick}
                                pickRoom={(roomId) => this.changeValue('room', roomId)}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Stack>
        )
    }
}
