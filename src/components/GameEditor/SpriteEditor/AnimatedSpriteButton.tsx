import { Direction, Animation, ActorData } from "@/definitions";
import { Sprite } from "@/lib/Sprite";
import { Button, Typography } from "@mui/material";
import { SpritePreview } from "../SpritePreview";
import spriteService from "@/services/spriteService";

interface Props {
    sprite: Sprite
    direction: Direction
    animation: Animation
    animationKey: string
    onClick: { (): void }
}

const buildActorData = (sprite: Sprite, animationKey: string, direction: Direction): ActorData => {

    const image = spriteService.get(sprite.id)?.getFrame(animationKey, 0, direction)?.image
    const widthScale = image?.widthScale || 1
    const heightScale = image?.heightScale || 1

    return {
        type: 'actor',
        id: 'preview',
        x: 75 / widthScale, y: 0,
        height: 150 / heightScale, width: 150 / widthScale,
        sprite: sprite.id,
        status: animationKey,
        direction
    }
}

export const AnimatedSpriteButton = ({ direction, sprite, animationKey, animation, onClick }: Props) => {

    const directionSet = !!animation[direction]

    return (
        <Button variant="outlined" onClick={onClick}>
            {directionSet ?
                <SpritePreview
                    overrideSprite={sprite}
                    data={buildActorData(sprite, animationKey, direction)}
                /> : <Typography>[{direction}]</Typography>
            }
        </Button>
    )
}