import { Direction, Animation, ActorData } from "@/definitions";
import { Sprite } from "@/lib/Sprite";
import { Button, Typography } from "@mui/material";
import { SpritePreview } from "../SpritePreview";

interface Props {
    sprite: Sprite
    direction: Direction
    animation: Animation
    animationKey: string
    isDefault?: boolean
    onClick: { (): void }
}

const buildActorData = (sprite: Sprite, animationKey: string, direction: Direction): ActorData => {
    const image = sprite.getFrame(animationKey, 0, direction)?.image
    const widthScale = image?.widthScale || 1
    const heightScale = image?.heightScale || 1

    return {
        type: 'actor',
        id: 'preview',
        x: 50 / widthScale,
        y: 0,
        height: 100 / heightScale,
        width: 100 / widthScale,
        sprite: sprite.id,
        status: animationKey,
        direction
    }
}

export const AnimatedSpriteButton = ({
    direction, sprite, animationKey, animation, onClick, isDefault
}: Props) => {
    const directionSet = !!animation[direction]

    return (
        <Button
            variant="outlined"
            color={isDefault ? "primary" : "secondary"}
            sx={{ minWidth: 80, minHeight: 80, padding: 0 }}
            onClick={onClick}
        >
            {directionSet ?
                <SpritePreview noBaseLine scale={.8}
                    overrideSprite={sprite}
                    data={buildActorData(sprite, animationKey, direction)}
                /> : <Typography>[{direction}]</Typography>
            }
        </Button>
    )
}