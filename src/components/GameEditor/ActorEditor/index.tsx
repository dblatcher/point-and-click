import { SchemaForm } from "@/components/SchemaForm";
import { NumberInput, OptionalNumberInput, SelectInput, StringInput } from "@/components/SchemaForm/inputs";
import { ActorData, Direction, Point, RoomData } from "@/definitions";
import { ActorDataSchema, SoundValue } from "@/definitions/ActorData";
import { directions } from "@/definitions/SpriteSheet";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { cloneData } from "@/lib/clone";
import { uploadJsonData } from "@/lib/files";
import { findById, listIds } from "@/lib/util";
import spriteService from "@/services/spriteService";
import { Box, Stack, Typography } from "@mui/material";
import { Component } from "react";
import { EditorHeading } from "../EditorHeading";
import { RecordEditor } from "../RecordEditor";
import { ServiceItemSelector } from "../ServiceItemSelector";
import { SpritePreview } from "../SpritePreview";
import { StorageMenu } from "../StorageMenu";
import { TabMenu } from "../TabMenu";
import { higherLevelSetStateWithAutosave, type DataItemEditorProps, type EnhancedSetStateFunction } from "../dataEditors";
import { PositionPreview } from "./PositionPreview";
import { SoundValueForm } from "./SoundValueForm";
import type { Sprite } from "@/lib/Sprite";

type ExtraState = {

}

type State = ActorData & { sprite: string | undefined } & ExtraState;

type Props = DataItemEditorProps<ActorData> & {
    rooms: RoomData[];
    actorIds: string[];
    actors: ActorData[];
    provideSprite: { (id: string): Sprite | undefined }
}

const makeBlankActor = (): ActorData => ({
    id: 'NEW_ACTOR',
    type: 'actor',
    name: undefined,
    status: undefined,

    sprite: spriteService.list()[0],
    direction: 'left',
    height: 150, width: 100,
    x: 0, y: 0, room: undefined,

    isPlayer: false,
    speed: 3,
    dialogueColor: '#000000',

})

const newSound = (): SoundValue => ({ soundId: "beep" })

export class ActorEditor extends Component<Props, State> {

    setStateWithAutosave: EnhancedSetStateFunction<State>

    constructor(props: Props) {
        super(props)

        const initialState = props.data ? {
            ...props.data
        } : makeBlankActor()

        this.state = {
            ...initialState
        }

        this.handleLoadButton = this.handleLoadButton.bind(this)
        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
        this.handlePreviewClick = this.handlePreviewClick.bind(this)
        this.changeValue = this.changeValue.bind(this)
        this.changeSoundMap = this.changeSoundMap.bind(this)
        this.setStateWithAutosave = higherLevelSetStateWithAutosave(this).bind(this)
    }

    get currentData(): ActorData {
        const actorData = cloneData(this.state) as State;
        return actorData
    }

    get existingIds(): string[] {
        return this.props.actorIds;
    }

    changeValue(propery: keyof ActorData, newValue: unknown) {
        const modification: Partial<State> = {}
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
                if (typeof newValue === 'string') {
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
            return this.setState(modification)
        }
        this.setStateWithAutosave(modification)
    }
    changeSoundMap(key: string, value?: SoundValue): void {
        this.setStateWithAutosave(state => {
            const { soundEffectMap = {} } = state
            if (typeof value === 'undefined') {
                delete soundEffectMap[key]
            } else {
                soundEffectMap[key] = value
            }
            return { soundEffectMap }
        })
    }
    handleLoadButton = async () => {
        const { data, error } = await uploadJsonData(ActorDataSchema)
        if (data) {
            this.setState(data)
        } else {
            console.warn("NOT ACTOR DATA", error)
        }
    }
    handleResetButton() {
        const { props } = this
        const initialState = props.data ? cloneData(props.data) : makeBlankActor()
        this.setState({
            ...initialState
        })
    }
    handleUpdateButton() {
        if (this.props.updateData) {
            this.props.updateData(this.currentData)
        }
    }
    handlePreviewClick(point: Point, pointRole: 'position' | 'walkTo') {
        switch (pointRole) {
            case 'position':
                return this.setStateWithAutosave(point)
            case 'walkTo': {
                const { x, y } = this.state;
                const walkToX = point.x - x
                const walkToY = point.y - y
                return this.setStateWithAutosave({ walkToX, walkToY })
            }
        }
    }

    get previewData(): ActorData {
        return {
            ...this.state,
            x: this.state.width / 2, y: 0
        }
    }

    get statusSuggestions(): string[] {
        const { sprite: spriteId, id } = this.state
        const { provideSprite } = this.props
        const sprite = provideSprite(spriteId)
        const sprites = sprite ? [sprite.data] : []
        return getStatusSuggestions(id, {
            sprites,
            actors: [this.state]
        })
    }

    get otherActorsInRoom(): ActorData[] {
        const { actors } = this.props
        const { id, room } = this.state
        const originalId = this.props.data?.id

        return actors.filter(actor =>
            actor.id !== id &&
            actor.id !== originalId &&
            actor.room === room
        )
    }

    render() {
        const { state, changeValue } = this
        const { sprite: spriteId, width = 1, height = 1, soundEffectMap = {}, walkToX, walkToY, id, name, status } = state
        const { actorIds } = this.props

        return (
            <Stack component='article' spacing={1}>
                <EditorHeading heading="Actor Editor" itemId={this.state.id} />

                <TabMenu tabs={[
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
                                data={state}
                                changeValue={(value, fieldDef) => {
                                    changeValue(fieldDef.key as keyof ActorData, value)
                                }}
                            />

                            <div>
                                <StringInput
                                    type="color" label="dialogue color" value={state.dialogueColor || ''}
                                    inputHandler={value => { changeValue('dialogueColor', value) }} />
                                <span>{state.dialogueColor}</span>
                            </div>
                        </Box>
                    },
                    {
                        label: 'sprite', content: (
                            <Stack direction={'row'} spacing={3}>
                                <Stack spacing={2}>
                                    <ServiceItemSelector legend="choose sprite"
                                        selectedItemId={spriteId}
                                        format='select'
                                        service={spriteService}
                                        select={
                                            item => this.setStateWithAutosave({ sprite: item.id })
                                        } />


                                    <Stack direction={'row'} spacing={2}>
                                        <NumberInput label="width" value={width}
                                            inputHandler={(value) => changeValue('width', value)} />
                                        <NumberInput label="height" value={height}
                                            inputHandler={(value) => changeValue('height', value)} />
                                    </Stack>

                                    <StringInput
                                        label="filter" value={state.filter || ''}
                                        inputHandler={(value) => changeValue('filter', value)} />
                                    <NumberInput
                                        label="display baseline" value={state.baseline || 0}
                                        min={0} max={state.height}
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
                                        addEntryLabel={'add sfx for:'}
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
                                    value={state.room || ''}
                                    optional={true}
                                    inputHandler={roomId => { changeValue('room', roomId) }} />
                                <Stack direction={'row'} spacing={2} maxWidth={300}>
                                    <NumberInput
                                        label="x" value={state.x}
                                        inputHandler={value => { changeValue('x', value) }} />
                                    <NumberInput
                                        label="y" value={state.y}
                                        inputHandler={value => { changeValue('y', value) }} />
                                    <SelectInput label="direction"
                                        value={state.direction || 'left'}
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
                            <StorageMenu
                                type="actorData"
                                data={this.currentData}
                                originalId={this.props.data?.id}
                                existingIds={actorIds}
                                reset={this.handleResetButton}
                                update={this.handleUpdateButton}
                                deleteItem={this.props.deleteData}
                                saveButton={true}
                                load={this.handleLoadButton}
                                options={this.props.options}
                            />
                        )
                    }
                ]} />



                <PositionPreview
                    actorData={this.state}
                    otherActors={this.otherActorsInRoom}
                    roomData={this.state.room ? findById(this.state.room, this.props.rooms) : undefined}
                    reportClick={this.handlePreviewClick}
                />

            </Stack>
        )
    }
}
