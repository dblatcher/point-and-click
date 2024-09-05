import { useGameDesign } from "@/context/game-design-context";
import { useSprites } from "@/context/sprite-context";
import { ActorData, SoundValue, SpriteFrame } from "@/definitions";
import { getStatusSuggestions } from "@/lib/animationFunctions";
import { cloneData } from "@/lib/clone";
import { findById } from "@/lib/util";
import soundService from "@/services/soundService";
import { Badge, Box, BoxProps, Button, Card, Dialog, DialogContent, DialogTitle, IconButton, Typography, useTheme } from "@mui/material";
import React, { Fragment, useState } from "react";
import { FileAssetSelector } from "../FileAssetSelector";
import { AddIcon, AudioFileOutlinedIcon, ClearIcon } from "../material-icons";
import { SoundAssetTestButton } from "../SoundAssetTestButton";
import { FramePreview } from "../SpriteEditor/FramePreview";
import { SpritePreview } from "../SpritePreview";
import imageService from "@/services/imageService";


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

const SoundBoxes = (props: {
    soundValues: SoundValue[],
    handleDeleteSound: { (index: number): void }
    frameIndex: number | undefined
    handleAddSound: { (frameIndex: number | undefined): void }
    boxProps?: BoxProps
}) => {
    const { soundValues, handleDeleteSound, frameIndex: frameIndex, handleAddSound, boxProps } = props
    const boxPropsWithDefaults: BoxProps = {
        component: Card,
        ...boxProps
    }
    return <>
        {soundValues.map((sv, index) =>
            <Fragment key={index}>
                {sv.frameIndex === frameIndex && (
                    <Box component={Card} {...boxPropsWithDefaults}>
                        <SoundAssetTestButton soundAssetId={sv.soundId} />
                        <Typography variant="caption">{sv.soundId}</Typography>
                        <IconButton color="warning" onClick={() => handleDeleteSound(index)}><ClearIcon /></IconButton>
                    </Box>
                )}
            </Fragment>
        )}
        <Button
            color='primary'
            endIcon={<AddIcon />}
            onClick={() => { handleAddSound(frameIndex) }}>add sound</Button>
    </>
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
            <DialogTitle>{activeAnimationKey}</DialogTitle>

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
                        return <Box key={frameIndex} component={Card} paddingX={2} minWidth={80} display={'flex'} flexDirection={'column'} alignItems={'center'} position={'relative'}>
                            <ActorFramePreview frame={frame} actor={actor} />
                            <SoundBoxes frameIndex={frameIndex}
                                {...{ handleAddSound, handleDeleteSound, soundValues: activeAnimationSounds }}
                            />
                            <Typography position={'absolute'} left={0} top={0}> {frameIndex + 1}</Typography>
                        </Box>
                    })}
                </Box>

                <SoundBoxes frameIndex={undefined}
                    {...{ handleAddSound, handleDeleteSound, soundValues: activeAnimationSounds }}
                    boxProps={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                />
            </DialogContent>
        </Dialog>
    </Box>
}
