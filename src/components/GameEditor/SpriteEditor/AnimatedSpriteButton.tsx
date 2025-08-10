import { Direction, Animation, ActorData } from "@/definitions";
import { Sprite } from "@/lib/Sprite";
import { Button, Typography } from "@mui/material";
import { SpritePreview } from "../SpritePreview";
import { buildActorData } from "@/lib/sprite-to-actor";

interface Props {
    sprite: Sprite
    direction: Direction
    animation: Animation
    animationKey: string
    isDefault?: boolean
    onClick: { (): void }
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