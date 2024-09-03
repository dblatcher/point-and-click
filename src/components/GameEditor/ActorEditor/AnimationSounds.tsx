import { useGameDesign } from "@/context/game-design-context";
import { ActorData, SoundValue } from "@/definitions";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import soundService from "@/services/soundService";
import { Badge, Box, Button, Card, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import React, { useState } from "react";
import { SpritePreview } from "../SpritePreview";
import { SoundValueForm } from "./SoundValueForm";
import { AudioFileOutlinedIcon } from "../material-icons";
import { useSprites } from "@/context/sprite-context";
import { findById } from "@/lib/util";
import { FramePreview } from "../SpriteEditor/FramePreview";
import { SoundAssetTestButton } from "../SoundAssetTestButton";


interface Props {
    actor: ActorData
    changeSoundMap: { (key: string, value?: SoundValue[]): void }
}

const newSound = (): SoundValue => ({ soundId: soundService.list()[0] })

const toSoundValueArray = (input: SoundValue | SoundValue[] | undefined): SoundValue[] => {
    if (!input) {
        return []
    }
    return Array.isArray(input) ? input : [input]
}

export const AnimationSounds: React.FunctionComponent<Props> = ({ actor, changeSoundMap }) => {
    const [activeAnimationKey, setActiveAnimationKey] = useState<string | undefined>(undefined)
    const sprites = useSprites()
    const { gameDesign } = useGameDesign()
    const sprite = findById(actor.sprite, sprites)
    if (!sprite) {
        return <Box>NO SPRITE</Box>
    }

    const { soundEffectMap = {} } = actor
    const statusSuggestions = getStatusSuggestions(actor.id, gameDesign)
    const activeAnimationSounds = activeAnimationKey ? toSoundValueArray(soundEffectMap[activeAnimationKey]) : [];

    const frames = activeAnimationKey ? sprite.getAnimation(activeAnimationKey, 'wait')[sprite.data.defaultDirection] ?? [] : []

    return <Box display={'flex'} flexWrap={'wrap'} gap={2}>

        {statusSuggestions.map(animation => (
            <Badge key={animation} color="secondary" badgeContent={toSoundValueArray(soundEffectMap[animation]).length} showZero >
                <Button variant="outlined" sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }} onClick={() => { setActiveAnimationKey(animation) }}>
                    <Typography>{animation}</Typography>
                    <SpritePreview data={actor} animation={animation} scale={.6} noBaseLine />

                    <AudioFileOutlinedIcon sx={{ position: 'absolute', left: 0, bottom: 0 }} />
                </Button>
            </Badge>
        ))}

        <Dialog open={!!activeAnimationKey} onClose={() => { setActiveAnimationKey(undefined) }}>
            <DialogTitle>{activeAnimationKey}</DialogTitle>

            <DialogContent>

                <Box display={'flex'} flexDirection={'row'} gap={2}>
                    {frames.map((frame, frameIndex) => {
                        return <Box key={frameIndex} component={Card} paddingX={2}>
                            {frameIndex + 1}
                            <FramePreview frame={frame} width={actor.width} height={actor.height} />
                            {activeAnimationSounds.filter(sv => sv.frameIndex === frameIndex).map((sv, index) =>
                                <Box key={index}>
                                    {sv.soundId}
                                    <SoundAssetTestButton soundAssetId={sv.soundId} />

                                </Box>
                            )}
                        </Box>
                    })}
                </Box>
                {activeAnimationSounds.filter(sv => sv.frameIndex === undefined).map((sv, index) =>
                    <Box key={index} component={Card} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        {sv.soundId}
                        <SoundAssetTestButton soundAssetId={sv.soundId} />
                    </Box>
                )}
            </DialogContent>
        </Dialog>

    </Box>
}