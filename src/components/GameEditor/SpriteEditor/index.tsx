import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { ActorData, Animation, Direction, SpriteData, SpriteFrame } from "@/definitions";
import { directions } from "@/definitions/SpriteSheet";
import { Sprite } from "@/lib/Sprite";
import { cloneData } from "@/lib/clone";
import { Box, ButtonGroup, Grid, Stack } from "@mui/material";
import { useState } from "react";
import { DeleteDataItemButton } from "../DeleteDataItemButton";
import { EditorHeading } from "../EditorHeading";
import { AnimationDialog } from "./AnimationDialog";
import { AnimationGrid } from "./AnimationGrid";
import { DownloadJsonButton } from "./DownloadJsonButton";
import { NewAnimationForm } from "./NewAnimationForm";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { findById } from "@/lib/util";


type SpriteEditorProps = {
    data: SpriteData;
}

export const SpriteEditor = (props: SpriteEditorProps) => {

    const sprites = useSprites()
    const { performUpdate } = useGameDesign()

    const [selectedAnimation, setSelectedAnimation] = useState<string | undefined>(undefined);
    const [selectedDirection, setSelectedDirection] = useState<Direction | undefined>(undefined);
    const [selectedRow, setSelectedRow] = useState<number>(0);
    const [selectedCol, setSelectedCol] = useState<number>(0);
    const [selectedSheetId, setSelectedSheetId] = useState<string | undefined>(undefined);

    const updateFromPartial = (mod: Partial<SpriteData>) => {
        performUpdate('sprites', { ...cloneData(props.data), ...mod })
    }

    const pickFrame = (newSelectedRow: number, newSelectedCol: number, newSelectedSheetId = selectedSheetId) => {
        if (
            newSelectedSheetId &&
            newSelectedSheetId === selectedSheetId &&
            newSelectedRow === selectedRow &&
            newSelectedCol === selectedCol
        ) {
            return appendFrame(newSelectedRow, newSelectedCol, newSelectedSheetId)
        }

        setSelectedCol(newSelectedCol)
        setSelectedRow(newSelectedRow)
        if (newSelectedSheetId) {
            setSelectedSheetId(newSelectedSheetId)
        }
    }

    const appendFrame = (newSelectedRow: number, newSelectedCol: number, newSelectedSheetId: string) => {
        const animations = cloneData(props.data.animations)
        const animation = selectedAnimation && animations[selectedAnimation]
        if (!animation) {
            return
        }
        const cycle = animation[selectedDirection ?? props.data.defaultDirection]
        if (!cycle) {
            return
        }
        cycle?.push({
            row: newSelectedRow,
            col: newSelectedCol,
            imageId: newSelectedSheetId,
        })
        updateFromPartial({ animations })
    }

    const changeValue = (propery: keyof SpriteData, newValue: string) => {
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
        updateFromPartial(modification)
    }

    const addAnimation = (animationKey: string) => {
        const { animations, defaultDirection } = cloneData(props.data);
        const newAnimation: Animation = {}
        newAnimation[defaultDirection] = []
        animations[animationKey] = newAnimation
        updateFromPartial({ animations })
        setSelectedAnimation(animationKey)
        setSelectedDirection(defaultDirection)
    }

    const copyAnimation = (newName: string, animationKey: string) => {
        const { animations } = cloneData(props.data);
        const newAnimation = cloneData(animations[animationKey]) as Animation
        animations[newName] = newAnimation
        updateFromPartial({ animations })
    }

    const deleteAnimation = (animationKey: string) => {
        const { animations } = cloneData(props.data);
        delete animations[animationKey]
        updateFromPartial({ animations })
    }

    const editCycle = (animationKey: string, direction: Direction, newValue: SpriteFrame[] | undefined) => {
        const { animations, defaultDirection } = cloneData(props.data);
        const animation = animations[animationKey]
        if (!animation) { return }
        if (newValue) {
            animation[direction] = newValue
        } if (direction !== defaultDirection && !newValue) {
            delete animation[direction]
        }

        updateFromPartial({ animations })
    }

    const buildActorData = (animation: string, direction: Direction): ActorData => {
        const sprite = findById(props.data.id, sprites)
        const image = sprite?.getFrame(animation, 0, direction)?.image
        const widthScale = image?.widthScale || 1
        const heightScale = image?.heightScale || 1

        return {
            type: 'actor',
            id: 'preview',
            x: 75 / widthScale, y: 0,
            height: 150 / heightScale, width: 150 / widthScale,
            sprite: props.data.id,
            status: animation,
            direction
        }
    }

    const { defaultDirection, animations, } = props.data
    const sprite = new Sprite(props.data)
    const animationEntries = Object.entries(animations)

    return <Stack component={'article'} spacing={1}>
        <EditorHeading heading="Sprite Editor" itemId={props.data?.id ?? '[new]'} >
            <ButtonGroup>
                <DeleteDataItemButton
                    dataItem={props.data}
                    itemType="sprites"
                    itemTypeName="sprite"
                />
                <DownloadJsonButton
                    dataItem={props.data}
                    itemTypeName="sprite"
                />
            </ButtonGroup>
        </EditorHeading>
        <Stack direction={'row'} spacing={2}>
            <Box minWidth={100}>
                <SelectInput
                    label="default direction"
                    value={defaultDirection}
                    options={directions}
                    inputHandler={(choice) => { changeValue('defaultDirection', choice as Direction) }}
                />
            </Box>

        </Stack>

        <Grid container spacing={1}>
            {animationEntries.map(([animationKey, animation]) => (
                <Grid xs={6} md={4} item key={animationKey} minWidth={260}>
                    <AnimationGrid
                        {...{ animationKey, animation, defaultDirection, sprite }}
                        deleteAnimation={deleteAnimation}
                        selectAnimationAndDirection={(selectedAnimation, selectedDirection) => {
                            setSelectedAnimation(selectedAnimation)
                            setSelectedDirection(selectedDirection)
                        }}
                        copyAnimation={(newName, animationKey) => {
                            console.log('rename', newName, animationKey)
                            copyAnimation(newName, animationKey)
                        }}
                    />
                </Grid>
            ))}

            <Grid xs={6} md={4} item minWidth={260}>
                <NewAnimationForm
                    existingKeys={Object.keys(props.data.animations)}
                    submit={addAnimation} />
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
            spriteData={props.data}
            actorData={(selectedAnimation && selectedDirection) ? buildActorData(selectedAnimation, selectedDirection) : undefined}
            editCycle={editCycle}
            pickFrame={pickFrame}
            close={() => {
                setSelectedAnimation(undefined)
                setSelectedDirection(undefined)
            }}
        />
    </Stack>
}