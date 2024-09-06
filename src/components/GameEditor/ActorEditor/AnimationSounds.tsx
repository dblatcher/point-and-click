import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { ActorData, SoundValue, SpriteFrame } from "@/definitions";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { cloneData } from "@/lib/clone";
import { findById } from "@/lib/util";
import imageService from "@/services/imageService";
import soundService from "@/services/soundService";
import { Badge, Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React, { useState } from "react";
import { FileAssetSelector } from "../FileAssetSelector";
import { AudioFileOutlinedIcon } from "../material-icons";
import { FramePreview } from "../SpriteEditor/FramePreview";
import { SpritePreview } from "../SpritePreview";
import { SoundBoxes } from "./SoundBoxes";


interface Props {
    actor: ActorData
    changeSoundMap: { (key: string, value?: SoundValue[]): void }
}

const toSoundValueArray = (input: SoundValue | SoundValue[] | undefined): SoundValue[] => {
    if (!input) {
        return []
    }
    return Array.isArray(input) ? input : [input]
}



const ActorFramePreview = (props: { frame: SpriteFrame, actor: ActorData }) => {
    const { frame, actor } = props
    const image = imageService.get(frame.imageId)
    const heightScale = image?.heightScale ?? 1
    const widthScale = image?.widthScale ?? 1
    return <FramePreview frame={frame} width={actor.width * widthScale} height={actor.height * heightScale} filter={actor.filter} />
}


export const AnimationSounds: React.FunctionComponent<Props> = ({ actor, changeSoundMap }) => {
    const [activeAnimationKey, setActiveAnimationKey] = useState<string | undefined>(undefined)
    const [soundId, setSoundId] = useState(soundService.list()[0])
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

    const handleAddSound = (frameIndex: number | undefined) => {
        if (!activeAnimationKey) {
            return
        }
        const newSoundValue: SoundValue = { soundId, frameIndex }
        changeSoundMap(activeAnimationKey, [...activeAnimationSounds, newSoundValue])
    }

    const editSound = (index: number, mod: Partial<SoundValue>) => {
        if (!activeAnimationKey) {
            return
        }
        const copy = cloneData(activeAnimationSounds)
        copy[index] = { ...copy[index], ...mod }
        changeSoundMap(activeAnimationKey, copy)
    }

    const handleDeleteSound = (index: number) => {
        if (!activeAnimationKey) {
            return
        }
        const copy = cloneData(activeAnimationSounds)
        copy.splice(index, 1)
        changeSoundMap(activeAnimationKey, copy)
    }

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

        <Dialog open={!!activeAnimationKey} onClose={() => { setActiveAnimationKey(undefined) }} fullWidth>
            <DialogTitle>Set animation sounds: <b>{activeAnimationKey}</b></DialogTitle>

            <DialogContent>

                <FileAssetSelector
                    selectedItemId={soundId}
                    service={soundService}
                    format="select"
                    legend="sfx to add"
                    select={(item) => {
                        console.log(item)
                        setSoundId(item.id)
                    }} />

                <Box display={'flex'} flexDirection={'row'} gap={2} flexWrap={'wrap'}>
                    {frames.map((frame, frameIndex) => {
                        return <Box key={frameIndex} 
                            sx={{
                                borderWidth:1,
                                borderColor: 'primary.dark',
                                borderStyle: 'solid',
                                boxSizing: 'border-box',
                            }}
                            paddingX={2} minWidth={100} display={'flex'} flexDirection={'column'} alignItems={'center'} position={'relative'}
                        >
                            <ActorFramePreview frame={frame} actor={actor} />
                            <SoundBoxes frameIndex={frameIndex}
                                {...{ handleAddSound, handleDeleteSound, soundValues: activeAnimationSounds, editSound }}
                            />
                            <Typography position={'absolute'} left={0} top={0}> {frameIndex + 1}</Typography>
                        </Box>
                    })}
                </Box>

                <SoundBoxes frameIndex={undefined} continual
                    {...{ handleAddSound, handleDeleteSound, soundValues: activeAnimationSounds, editSound }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setActiveAnimationKey(undefined)}>done</Button>
            </DialogActions>
        </Dialog>
    </Box>
}
