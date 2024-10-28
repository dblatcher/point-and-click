import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { ActorData, SoundValue, SpriteFrame } from "@/definitions";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { cloneData } from "@/lib/clone";
import { findById } from "@/lib/util";
import soundService from "@/services/soundService";
import { Alert, Box, Button, Divider, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
import { FileAssetSelector } from "../FileAssetSelector";
import { AddIcon, AudioFileOutlinedIcon } from "../material-icons";
import { FramePreview } from "../SpriteEditor/FramePreview";
import { SpritePreview } from "../SpritePreview";
import { SoundBoxes } from "./SoundBoxes";
import { useAssets } from "@/context/asset-context";


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
    const { getImageAsset } = useAssets()
    const imageAsset = getImageAsset(frame.imageId)
    const heightScale = imageAsset?.heightScale ?? 1
    const widthScale = imageAsset?.widthScale ?? 1
    return <FramePreview
        frame={frame}
        width={actor.width * widthScale}
        height={actor.height * heightScale}
        filter={actor.filter} />
}


export const AnimationSounds: React.FunctionComponent<Props> = ({ actor, changeSoundMap }) => {
    const [activeAnimationKey, setActiveAnimationKey] = useState<string | undefined>(undefined)
    const [soundId, setSoundId] = useState(soundService.list()[0])
    const sprites = useSprites()
    const { gameDesign } = useGameDesign()
    const sprite = findById(actor.sprite, sprites)
    if (!sprite) {
        return <Box>
            <Alert severity="info">
                <p>No sprite</p>
                <p>To set animation sound effects for an actor, you must first choose a sprite.</p>
            </Alert>
        </Box>
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

    return <>
        <Typography>Pick animation</Typography>
        <Box display={'flex'} flexWrap={'wrap'} gap={2} marginBottom={4}>
            {statusSuggestions.map(animation => (
                <Button variant={animation === activeAnimationKey ? 'contained' : "outlined"} key={animation}
                    sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}
                    onClick={() => { setActiveAnimationKey(animation) }}>
                    <SpritePreview data={actor} animation={animation} noBaseLine />
                    <Typography>{animation}</Typography>
                    <AudioFileOutlinedIcon sx={{ position: 'absolute', left: 0, top: 0 }} />
                    <Typography position={'absolute'} top={0} right={0}>{`x ${toSoundValueArray(soundEffectMap[animation]).length}`}</Typography>
                </Button>
            ))}
        </Box>

        {activeAnimationKey && (<>
            <Divider />
            <Typography>Edit sfx for <strong>{activeAnimationKey}</strong> animation</Typography>
            <FileAssetSelector
                selectedItemId={soundId}
                service={soundService}
                format="select"
                legend="sfx to add"
                select={(item) => setSoundId(item.id)} />
            <Box display={'flex'} flexDirection={'row'} gap={2} flexWrap={'wrap'}>
                {frames.map((frame, frameIndex) => (
                    <Box key={frameIndex}
                        sx={{
                            borderWidth: 1,
                            borderColor: 'primary.dark',
                            borderStyle: 'solid',
                            boxSizing: 'border-box',
                        }}
                        paddingX={2} minWidth={100} display={'flex'} flexDirection={'column'} alignItems={'center'} position={'relative'}
                    >
                        <ActorFramePreview frame={frame} actor={actor} />
                        <SoundBoxes frameIndex={frameIndex}
                            {...{ handleDeleteSound, soundValues: activeAnimationSounds, editSound }}
                        />
                        <Typography position={'absolute'} left={0} top={0}> {frameIndex + 1}</Typography>
                        <Box position={'absolute'} right={0} top={0}>
                            <IconButton color="primary" title="add sound" onClick={() => handleAddSound(frameIndex)} >
                                <AddIcon />
                                <AudioFileOutlinedIcon />
                            </IconButton>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Button variant="outlined" fullWidth
                endIcon={<><AddIcon /><AudioFileOutlinedIcon /></>}
                onClick={() => handleAddSound(undefined)}
            >Add continual sound</Button>
            <SoundBoxes frameIndex={undefined} continual
                {...{ handleAddSound, handleDeleteSound, soundValues: activeAnimationSounds, editSound }}
            />
        </>)}
    </>
}
