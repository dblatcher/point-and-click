import { Sprite } from "@/lib/Sprite";
import { Stack } from "@mui/material";
import { Animation, Direction, directions } from "point-click-lib";
import { ReactElement } from "react";
import { ButtonWithConfirm } from "../ButtonWithConfirm";
import { ButtonWithTextInput } from "../ButtonWithTextInput";
import { EditorBox } from "../layout/EditorBox";
import { ContentCopyIcon, DeleteIcon } from "../material-icons";
import { AnimatedSpriteButton } from "./AnimatedSpriteButton";

interface Props {
    animationKey: string
    animation: Animation
    sprite: Sprite
    defaultDirection: Direction
    deleteAnimation: { (animationKey: string): void }
    copyAnimation: { (newName: string, animationKey: string): void }
    selectAnimationAndDirection: { (selectedAnimation: string, selectedDirection: Direction): void }
}


export const AnimationGrid = ({ animation, animationKey, sprite, defaultDirection, deleteAnimation, copyAnimation, selectAnimationAndDirection }: Props) => {
    const renderedButtons: Partial<Record<Direction, ReactElement>> = {}
    {
        directions.forEach(direction => {
            renderedButtons[direction] = <AnimatedSpriteButton key={direction}
                onClick={() => selectAnimationAndDirection(animationKey, direction)}
                sprite={sprite}
                direction={direction}
                animation={animation}
                animationKey={animationKey}
                isDefault={direction === defaultDirection}
            />
        })
    }

    return (
        <EditorBox title={animationKey} boxProps={{ minWidth: 240 }}
            barContent={
                <>
                    <ButtonWithTextInput
                        useIconButton icon={<ContentCopyIcon />}
                        label={`Copy animation "${animationKey}"`}
                        dialogTitle={`Copy "${animationKey}" as...`}
                        onEntry={newName => { copyAnimation(newName, animationKey) }}
                    />
                    {animationKey !== 'default' &&
                        <ButtonWithConfirm
                            useIconButton icon={<DeleteIcon />}
                            label={`Delete animation "${animationKey}"`}
                            onClick={() => deleteAnimation(animationKey)} />
                    }
                </>
            }
        >
            <Stack alignItems={'center'} justifyContent={'flex-end'} minHeight={160}>
                <Stack direction={'row'} alignItems={'center'}>
                    {renderedButtons.left}
                    <Stack>
                        {renderedButtons.up}
                        {renderedButtons.down}
                    </Stack>
                    {renderedButtons.right}
                </Stack>
            </Stack>
        </EditorBox>
    )
}