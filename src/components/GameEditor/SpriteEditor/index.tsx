import { SelectInput } from "@/components/SchemaForm/SelectInput";
import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { ActorData, Animation, Direction, SpriteData, SpriteFrame } from "@/definitions";
import { directions } from "@/definitions/SpriteSheet";
import { Sprite } from "@/lib/Sprite";
import { cloneData } from "@/lib/clone";
import { patchMember } from "@/lib/update-design";
import { findById } from "@/lib/util";
import { Box, Grid, Stack } from "@mui/material";
import { useState } from "react";
import { EditorHeading } from "../layout/EditorHeading";
import { ItemEditorHeaderControls } from "../game-item-components/ItemEditorHeaderControls";
import { AnimationDialog } from "./AnimationDialog";
import { AnimationGrid } from "./AnimationGrid";
import { useAssets } from "@/context/asset-context";
import { ButtonWithTextInput } from "../ButtonWithTextInput";
import { AddIcon } from "../material-icons";
import { SearchControl } from "../SearchControl";


type SpriteEditorProps = {
    data: SpriteData;
}

export const SpriteEditor = (props: SpriteEditorProps) => {

    const sprites = useSprites()
    const { applyModification, gameDesign } = useGameDesign()
    const { getImageAsset } = useAssets()

    const [selectedAnimation, setSelectedAnimation] = useState<string>();
    const [selectedDirection, setSelectedDirection] = useState<Direction>();
    const [searchInput, setSearchInput] = useState('');

    const { defaultDirection, animations, } = props.data
    const sprite = new Sprite(props.data, getImageAsset)
    const animationEntries = Object.entries(animations)
    const existingKeys = Object.keys(animations);
    const filteredAnimationEntries = searchInput.length === 0 ? animationEntries : animationEntries.filter(([key]) => key.toLowerCase().includes(searchInput.toLowerCase()))

    const updateFromPartial = (mod: Partial<SpriteData>, description?: string) => {
        applyModification(description ?? `update sprite ${props.data.id}`, { sprites: patchMember(props.data.id, mod, gameDesign.sprites) })
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
        if (existingKeys.includes(animationKey)) {
            return
        }
        const { animations, defaultDirection } = cloneData(props.data);
        const newAnimation: Animation = {}
        newAnimation[defaultDirection] = []
        animations[animationKey] = newAnimation
        updateFromPartial({ animations }, `add animation "${animationKey}" to sprite ${props.data.id}`)
        setSelectedAnimation(animationKey)
        setSelectedDirection(defaultDirection)
    }

    const copyAnimation = (newName: string, animationKey: string) => {
        const { animations } = cloneData(props.data);
        const newAnimation = cloneData(animations[animationKey]) as Animation
        animations[newName] = newAnimation
        updateFromPartial({ animations }, `copy animation "${animationKey}" as "${newName}" on sprite ${props.data.id}`)
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

    return <Stack component={'article'} spacing={1}>
        <EditorHeading heading="Sprite Editor" itemId={props.data?.id ?? '[new]'} >
            <ItemEditorHeaderControls
                dataItem={props.data}
                itemType="sprites"
                itemTypeName="sprite"
            />
        </EditorHeading>
        <Stack direction={'row'} spacing={4}>
            <Box minWidth={100}>
                <SelectInput
                    label="default direction"
                    value={defaultDirection}
                    options={directions}
                    inputHandler={(choice) => { changeValue('defaultDirection', choice as Direction) }}
                />
            </Box>
            <SearchControl searchInput={searchInput} setSearchInput={setSearchInput} />
        </Stack>

        <Grid container spacing={1}>
            {filteredAnimationEntries.map(([animationKey, animation]) => (
                <Grid xs={4} md={3} item key={animationKey} minWidth={260}>
                    <AnimationGrid
                        {...{ animationKey, animation, defaultDirection, sprite }}
                        deleteAnimation={deleteAnimation}
                        selectAnimationAndDirection={(selectedAnimation, selectedDirection) => {
                            setSelectedAnimation(selectedAnimation)
                            setSelectedDirection(selectedDirection)
                        }}
                        copyAnimation={(newName, animationKey) => {
                            copyAnimation(newName, animationKey)
                        }}
                    />
                </Grid>
            ))}

            <Grid xs={4} md={3} item minWidth={260} minHeight={190} display={'flex'}>
                <ButtonWithTextInput
                    buttonProps={{
                        variant: 'outlined',
                        fullWidth: true,
                        startIcon: <AddIcon />
                    }}
                    suggestions={Array.from(new Set(Object.values(Sprite.DEFAULT_ANIMATION)
                        .filter(value => !existingKeys.includes(value))))}
                    clearOnOpen
                    getError={input => {
                        if (existingKeys.includes(input)) {
                            return `animation "${input}" already exists`
                        }
                        return undefined;
                    }}
                    label="add animation"
                    onEntry={addAnimation}
                    dialogTitle={"enter animation name"} />
            </Grid>
        </Grid>

        <AnimationDialog
            {...{
                selectedAnimation,
                selectedDirection,
                overrideSprite: sprite,

            }}
            spriteData={props.data}
            actorData={(selectedAnimation && selectedDirection) ? buildActorData(selectedAnimation, selectedDirection) : undefined}
            editCycle={editCycle}
            close={() => {
                setSelectedAnimation(undefined)
                setSelectedDirection(undefined)
            }}
        />
    </Stack>
}