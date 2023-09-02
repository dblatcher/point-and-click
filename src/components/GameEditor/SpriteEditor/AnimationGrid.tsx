import { Animation } from "@/definitions";
import { Direction, directions } from "@/definitions/BaseTypes";
import { Stack } from "@mui/material";
import { ButtonWithConfirm } from "../ButtonWithConfirm";
import { EditorBox } from "../EditorBox";
import { AnimatedSpriteButton } from "./AnimatedSpriteButton";
import { Sprite } from "@/lib/Sprite";

interface Props {
    animationKey: string
    animation: Animation
    sprite: Sprite
    defaultDirection: Direction
    deleteAnimation: { (animationKey: string): void }
    selectAnimationAndDirection: { (selectedAnimation: string, selectedDirection: Direction): void }
}


export const AnimationGrid = ({ animation, animationKey, sprite, defaultDirection, deleteAnimation, selectAnimationAndDirection }: Props) => {

    const renderedButtons: Partial<Record<Direction, JSX.Element>> = {}

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
        <EditorBox title={animationKey} boxProps={{ minWidth: 240 }}>
            <Stack alignItems={'center'} justifyContent={'flex-end'} minHeight={200}>
                {animationKey !== 'default' &&
                    <ButtonWithConfirm
                        label={`Delete animation "${animationKey}"`}
                        onClick={() => deleteAnimation(animationKey)} />
                }
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