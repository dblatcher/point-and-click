
import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { StringInput } from "@/components/SchemaForm/StringInput";
import { ActorData, Animation, Direction, SpriteData, SpriteFrame } from "@/definitions";
import { SpriteDataSchema, directions } from "@/definitions/SpriteSheet";
import { Sprite } from "@/lib/Sprite";
import { cloneData } from "@/lib/clone";
import { uploadJsonData } from "@/lib/files";
import { Grid, Stack } from "@mui/material";
import { Component } from "react";
import { EditorBox } from "../EditorBox";
import { EditorHeading } from "../EditorHeading";
import { StorageMenu } from "../StorageMenu";
import { higherLevelSetStateWithAutosave, type DataItemEditorProps, type EnhancedSetStateFunction } from "../dataEditors";
import { AnimationDialog } from "./AnimationDialog";
import { AnimationGrid } from "./AnimationGrid";
import { NewAnimationForm } from "./NewAnimationForm";
import { makeBlankSprite } from "../defaults";


type ExtraState = {
    selectedAnimation?: string;
    selectedDirection?: Direction;
    selectedRow: number;
    selectedCol: number;
    selectedSheetId?: string;
}

type SpriteEditorState = SpriteData & ExtraState;

type SpriteEditorProps = DataItemEditorProps<SpriteData> & {
    provideSprite: { (id: string): Sprite | undefined }
    spriteIds: string[];
}

export class SpriteEditor extends Component<SpriteEditorProps, SpriteEditorState>{

    setStateWithAutosave: EnhancedSetStateFunction<SpriteEditorState>

    constructor(props: SpriteEditorProps) {
        super(props)

        const initialData = props.data ? cloneData(props.data) : makeBlankSprite()

        this.state = {
            ...initialData,
            selectedAnimation: undefined,
            selectedCol: 0,
            selectedRow: 0,
        }
        this.handleNewButton = this.handleNewButton.bind(this)
        this.handleLoadButton = this.handleLoadButton.bind(this)
        this.handleResetButton = this.handleResetButton.bind(this)
        this.handleUpdateButton = this.handleUpdateButton.bind(this)
        this.addAnimation = this.addAnimation.bind(this)
        this.copyAnimation = this.copyAnimation.bind(this)
        this.editCycle = this.editCycle.bind(this)
        this.buildActorData = this.buildActorData.bind(this)
        this.deleteAnimation = this.deleteAnimation.bind(this)
        this.pickFrame = this.pickFrame.bind(this)
        this.setStateWithAutosave = (input, callback) => {
            higherLevelSetStateWithAutosave(this).bind(this)(input, callback);
        }
    }

    get currentData(): SpriteData {
        const data = cloneData(this.state as SpriteData & Partial<ExtraState>);
        delete data.selectedAnimation;
        delete data.selectedRow;
        delete data.selectedCol;
        delete data.selectedSheetId;
        return data
    }

    get existingIds(): string[] {
        return this.props.spriteIds
    }

    pickFrame(selectedRow: number, selectedCol: number, selectedSheetId?: string) {
        this.setState({
            selectedCol, selectedRow, selectedSheetId
        })
    }

    changeValue(propery: keyof SpriteData, newValue: string) {
        const modification: Partial<SpriteEditorState> = {}
        switch (propery) {
            case 'id':
                if (typeof newValue === 'string') {
                    modification[propery] = newValue.toUpperCase()
                }
                break;
            case 'defaultDirection':
                if (directions.includes(newValue as Direction)) {
                    modification[propery] = newValue as Direction
                }
                break;
        }
        if (propery === 'id') {
            return this.setState({...this.state, ...modification})
        }
        this.setStateWithAutosave(modification)
    }

    addAnimation(animationKey: string) {
        this.setStateWithAutosave(state => {
            const { animations, defaultDirection } = state
            const newAnimation: Animation = {}
            newAnimation[defaultDirection] = []
            animations[animationKey] = newAnimation
            return {
                animations,
                selectedAnimation: animationKey,
                selectedDirection: defaultDirection
            }
        })
    }

    copyAnimation(newName: string, animationKey: string) {
        this.setStateWithAutosave(state => {
            const { animations, defaultDirection } = state
            const newAnimation = cloneData(animations[animationKey]) as Animation
            animations[newName] = newAnimation
            return {
                animations,
            }
        })
    }

    deleteAnimation(animationKey: string) {
        this.setStateWithAutosave(state => {
            const { animations } = state
            delete animations[animationKey]
            return { animations }
        })
    }

    editCycle(animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined) {
        this.setStateWithAutosave(state => {
            const { animations, defaultDirection } = state
            const animation = animations[animationKey]
            if (!animation) { return {} }

            if (newValue) {
                animation[direction] = newValue
            } if (direction !== defaultDirection && !newValue) {
                delete animation[direction]
            }
            return { animations }
        })
    }

    handleNewButton() {
        const newSprite = makeBlankSprite()
        this.setState(newSprite)
    }
    handleLoadButton = async () => {
        const { data, error } = await uploadJsonData(SpriteDataSchema)
        if (data) {
            this.setState(data)
        } else {
            console.warn("NOT SPRITE DATA", error)
        }
    }

    handleResetButton() {
        const { props } = this
        const initialState = props.data ? cloneData(props.data) : makeBlankSprite()
        this.setState({
            ...initialState
        })
    }
    handleUpdateButton() {
        const { currentData } = this
        if (this.props.updateData) {
            this.props.updateData(currentData)
        }
    }

    buildSprite(): Sprite {
        return new Sprite(this.state)
    }

    buildActorData(animation: string, direction: Direction): ActorData {
        const { state } = this
        const { provideSprite } = this.props
        const image = provideSprite(state.id)?.getFrame(animation, 0, direction)?.image
        const widthScale = image?.widthScale || 1
        const heightScale = image?.heightScale || 1

        return {
            type: 'actor',
            id: 'preview',
            x: 75 / widthScale, y: 0,
            height: 150 / heightScale, width: 150 / widthScale,
            sprite: state.id,
            status: animation,
            direction
        }
    }

    render() {
        const { id, defaultDirection, animations, selectedAnimation, selectedCol, selectedRow, selectedSheetId, selectedDirection } = this.state
        const { spriteIds } = this.props
        const sprite = this.buildSprite()
        const animationEntries = Object.entries(animations)

        return <Stack component={'article'} spacing={1}>
            <EditorHeading heading="Sprite Editor" itemId={this.props.data?.id ?? '[new]'} />

            <Stack direction={'row'} spacing={2}>
                <EditorBox title="config">
                    <Stack spacing={2}>
                        <StringInput label="sprite ID"
                            value={id}
                            inputHandler={value => this.changeValue('id', value)} />
                        <SelectInput
                            label="default direction"
                            value={defaultDirection}
                            options={directions}
                            inputHandler={(choice) => { this.setState({ defaultDirection: choice as Direction }) }}
                        />
                    </Stack>
                </EditorBox>
                <StorageMenu
                    data={this.currentData}
                    originalId={this.props.data?.id}
                    existingIds={spriteIds}
                    type='sprite'
                    update={this.handleUpdateButton}
                    reset={this.handleResetButton}
                    saveButton={true}
                    load={this.handleLoadButton}
                    deleteItem={this.props.deleteData}
                    options={this.props.options}
                />
            </Stack>

            <Grid container spacing={1}>
                {animationEntries.map(([animationKey, animation]) => (
                    <Grid xs={6} md={4} item key={animationKey} minWidth={260}>
                        <AnimationGrid
                            {...{ animationKey, animation, defaultDirection, sprite }}
                            deleteAnimation={this.deleteAnimation}
                            selectAnimationAndDirection={(selectedAnimation, selectedDirection) => {
                                this.setState({ selectedAnimation, selectedDirection })
                            }}
                            copyAnimation={(newName, animationKey) => {
                                console.log('rename', newName, animationKey)
                                this.copyAnimation(newName, animationKey)
                            }}
                        />
                    </Grid>
                ))}

                <Grid xs={6} md={4} item minWidth={260}>
                    <NewAnimationForm
                        existingKeys={Object.keys(this.state.animations)}
                        submit={this.addAnimation} />
                </Grid>
            </Grid>

            <AnimationDialog
                {...{
                    selectedAnimation,
                    selectedDirection,
                    overrideSprite: sprite,
                    selectedRow,
                    selectedCol,
                    selectedSheetId,
                }}
                spriteData={this.state}
                actorData={(selectedAnimation && selectedDirection) ? this.buildActorData(selectedAnimation, selectedDirection) : undefined}
                editCycle={this.editCycle}
                pickFrame={this.pickFrame}
                close={() => {
                    this.setState({
                        selectedAnimation: undefined,
                        selectedDirection: undefined
                    })
                }}
            />
        </Stack>
    }
}