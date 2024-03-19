import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { ActorData, Animation, Direction, SpriteData, SpriteFrame } from "@/definitions";
import { directions } from "@/definitions/SpriteSheet";
import { Sprite } from "@/lib/Sprite";
import { cloneData } from "@/lib/clone";
import { Box, Grid, Stack } from "@mui/material";
import { Component } from "react";
import { EditorOptions } from "..";
import { DeleteDataItemButton } from "../DeleteDataItemButton";
import { EditorHeading } from "../EditorHeading";
import { AnimationDialog } from "./AnimationDialog";
import { AnimationGrid } from "./AnimationGrid";
import { DownloadJsonButton } from "./DownloadJsonButton";
import { NewAnimationForm } from "./NewAnimationForm";

type ExtraState = {
    selectedAnimation?: string;
    selectedDirection?: Direction;
    selectedRow: number;
    selectedCol: number;
    selectedSheetId?: string;
}

type SpriteEditorState = ExtraState;

type SpriteEditorProps = {
    data: SpriteData;
    updateData: (data: SpriteData) => void;
    deleteData: (index: number) => void;
    options: EditorOptions;
    provideSprite: { (id: string): Sprite | undefined }
    spriteIds: string[];
}

export class SpriteEditor extends Component<SpriteEditorProps, SpriteEditorState>{

    constructor(props: SpriteEditorProps) {
        super(props)
        this.state = {
            selectedAnimation: undefined,
            selectedCol: 0,
            selectedRow: 0,
        }
        this.addAnimation = this.addAnimation.bind(this)
        this.copyAnimation = this.copyAnimation.bind(this)
        this.editCycle = this.editCycle.bind(this)
        this.buildActorData = this.buildActorData.bind(this)
        this.deleteAnimation = this.deleteAnimation.bind(this)
        this.pickFrame = this.pickFrame.bind(this)
        this.updateFromPartial = this.updateFromPartial.bind(this)
    }

    get currentData(): SpriteData {
        const data = cloneData(this.props.data);
        return data
    }

    get existingIds(): string[] {
        return this.props.spriteIds
    }

    updateFromPartial(input: { (): Partial<SpriteData> }): void {

        const mod = input()

        this.props.updateData({ ...this.props.data, ...mod })

    }

    pickFrame(selectedRow: number, selectedCol: number, selectedSheetId?: string) {
        this.setState({
            selectedCol, selectedRow, selectedSheetId
        })
    }

    changeValue(propery: keyof SpriteData, newValue: string) {
        const modification: Partial<SpriteData> = {}
        if (propery === 'id') {
            return console.warn('cannot change id', { newValue })
        }
        switch (propery) {
            case 'defaultDirection':
                if (directions.includes(newValue as Direction)) {
                    modification[propery] = newValue as Direction
                }
                break;
        }
        this.updateFromPartial(() => modification)
    }

    addAnimation(animationKey: string) {
        this.updateFromPartial(() => {
            const { animations, defaultDirection } = this.props.data
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
        this.updateFromPartial(() => {
            const { animations, defaultDirection } = this.props.data
            const newAnimation = cloneData(animations[animationKey]) as Animation
            animations[newName] = newAnimation
            return {
                animations,
            }
        })
    }

    deleteAnimation(animationKey: string) {
        this.updateFromPartial(() => {
            const { animations } = this.props.data
            delete animations[animationKey]
            return { animations }
        })
    }

    editCycle(animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined) {
        this.updateFromPartial(() => {
            const { animations, defaultDirection } = this.props.data
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

    buildSprite(): Sprite {
        return new Sprite(this.props.data)
    }

    buildActorData(animation: string, direction: Direction): ActorData {
        const { provideSprite } = this.props
        const image = provideSprite(this.props.data.id)?.getFrame(animation, 0, direction)?.image
        const widthScale = image?.widthScale || 1
        const heightScale = image?.heightScale || 1

        return {
            type: 'actor',
            id: 'preview',
            x: 75 / widthScale, y: 0,
            height: 150 / heightScale, width: 150 / widthScale,
            sprite: this.props.data.id,
            status: animation,
            direction
        }
    }

    render() {
        const { selectedAnimation, selectedCol, selectedRow, selectedSheetId, selectedDirection } = this.state
        const { defaultDirection, animations, } = this.props.data
        const { spriteIds } = this.props
        const sprite = this.buildSprite()
        const animationEntries = Object.entries(animations)

        return <Stack component={'article'} spacing={1}>
            <EditorHeading heading="Sprite Editor" itemId={this.props.data?.id ?? '[new]'} />

            <Stack direction={'row'} spacing={2}>
                <Box minWidth={100}>
                    <SelectInput
                        label="default direction"
                        value={defaultDirection}
                        options={directions}
                        inputHandler={(choice) => { this.changeValue('defaultDirection', choice as Direction) }}
                    />
                </Box>
                <DeleteDataItemButton
                    dataItem={this.props.data}
                    itemType="sprites"
                    itemTypeName="sprite"
                />
                <DownloadJsonButton
                    dataItem={this.props.data}
                    itemTypeName="sprite"
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
                        existingKeys={Object.keys(this.props.data.animations)}
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
                spriteData={this.props.data}
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