
import { ActorData, Animation, Direction, SpriteData, SpriteFrame } from "@/definitions";
import { SpriteDataSchema, directions } from "@/definitions/SpriteSheet";
import { Sprite } from "@/lib/Sprite";
import { cloneData } from "@/lib/clone";
import { uploadJsonData } from "@/lib/files";
import { eventToString } from "@/lib/util";
import spriteService from "@/services/spriteService";
import { Box, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { Component } from "react";
import { ButtonWithConfirm } from "../ButtonWithConfirm";
import { EditorHeading } from "../EditorHeading";
import { StorageMenu } from "../StorageMenu";
import { higherLevelSetStateWithAutosave, type DataItemEditorProps, type EnhancedSetStateFunction } from "../dataEditors";
import editorStyles from '../editorStyles.module.css';
import { StringInput } from "../formControls";
import { AnimatedSpriteButton } from "./AnimatedSpriteButton";
import { AnimationDialog } from "./AnimationDialog";
import { NewAnimationForm } from "./NewAnimationForm";

type ExtraState = {
    selectedAnimation?: string;
    selectedDirection?: Direction;
    selectedRow: number;
    selectedCol: number;
    selectedSheetId?: string;
}

type SpriteEditorState = SpriteData & ExtraState;

type SpriteEditorProps = DataItemEditorProps<SpriteData> & {
    spriteIds: string[];
}

function getBlankSprite(): SpriteData {
    return {
        id: 'NEW_SPRITE',
        defaultDirection: 'left',
        animations: {
            default: {
                left: []
            }
        }
    }
}

export class SpriteEditor extends Component<SpriteEditorProps, SpriteEditorState>{

    setStateWithAutosave: EnhancedSetStateFunction<SpriteEditorState>

    constructor(props: SpriteEditorProps) {
        super(props)

        const initialData = props.data ? cloneData(props.data) : getBlankSprite()

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
        this.editCycle = this.editCycle.bind(this)
        this.buildActorData = this.buildActorData.bind(this)
        this.pickFrame = this.pickFrame.bind(this)
        this.setStateWithAutosave = (input, callback) => {
            higherLevelSetStateWithAutosave(this).bind(this)(input, callback)
            spriteService.add(new Sprite(this.currentData))
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
            return this.setState(modification)
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
        const newSprite = getBlankSprite()
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
        const initialState = props.data ? cloneData(props.data) : getBlankSprite()
        this.setState({
            ...initialState
        })
    }
    handleUpdateButton() {
        const { currentData } = this
        spriteService.add(new Sprite(currentData))
        if (this.props.updateData) {
            this.props.updateData(currentData)
        }
    }

    buildSprite(): Sprite {
        return new Sprite(this.state)
    }

    buildActorData(animation: string, direction: Direction): ActorData {
        const { state } = this
        const image = spriteService.get(state.id)?.getFrame(animation, 0, direction)?.image
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
        const overrideSprite = this.buildSprite()

        const animationEntries = Object.entries(animations)

        return <Box component={'article'}>
            <EditorHeading heading="Sprite Editor" itemId={this.props.data?.id ?? '[new]'} />
            <div className={editorStyles.container}>

                <fieldset className={editorStyles.fieldset}>
                    <legend>Sprite</legend>
                    <div className={editorStyles.row}>
                        <StringInput label="sprite ID"
                            value={id}
                            inputHandler={value => this.changeValue('id', value)} />
                    </div>
                    <div className={editorStyles.row}>
                        <label>Default Direction</label>
                        <select value={defaultDirection} onChange={event => this.changeValue('defaultDirection', eventToString(event))}>
                            {directions.map(direction => <option key={direction}>{direction}</option>)}
                        </select>
                    </div>
                </fieldset>

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
            </div>

            <Stack spacing={1}>
                {animationEntries.map(([animationKey, animation]) => {
                    return (
                        <Box key={animationKey}>
                            <Typography variant="h4">{animationKey}</Typography>
                            <Stack direction={'row'}>
                                {directions.map(direction => (

                                    <AnimatedSpriteButton key={direction}
                                        onClick={() => {
                                            this.setState({ selectedAnimation: animationKey, selectedDirection: direction })
                                        }}
                                        sprite={overrideSprite}
                                        direction={direction}
                                        animation={animation}
                                        animationKey={animationKey}
                                    />
                                ))}

                                {animationKey !== 'default' &&
                                    <ButtonWithConfirm
                                        label={`Delete animation "${animationKey}"`}
                                        onClick={() => this.deleteAnimation(animationKey)} />
                                }
                            </Stack>
                        </Box>
                    )
                })}

                <NewAnimationForm existingKeys={Object.keys(this.state.animations)} submit={this.addAnimation} />
            </Stack>

            <Dialog fullWidth maxWidth={'xl'}
                scroll="paper"
                open={!!selectedAnimation && !!selectedDirection}
                onClose={() => {
                    this.setState({
                        selectedAnimation: undefined,
                        selectedDirection: undefined
                    })
                }}>

                <DialogContent>
                    <DialogTitle>
                        {selectedAnimation}/{selectedDirection}{selectedDirection === defaultDirection && <span>(default)</span>}
                    </DialogTitle>

                    {(selectedAnimation && selectedDirection) && (
                        <AnimationDialog
                            {...{
                                selectedAnimation,
                                selectedDirection,
                                overrideSprite,
                                selectedRow,
                                selectedCol,
                                selectedSheetId,
                            }}
                            spriteData={this.state}
                            actorData={this.buildActorData(selectedAnimation, selectedDirection)}
                            editCycle={this.editCycle}
                            pickFrame={this.pickFrame}
                        />
                    )}

                </DialogContent>
            </Dialog>
        </Box>
    }
}