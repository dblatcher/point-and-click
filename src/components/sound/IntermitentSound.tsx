import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { SoundControl } from "sound-deck";
import soundService from "@/services/soundService";
import type { SoundValue } from "@/definitions";

interface Props {
    soundValue?: SoundValue;
    isPaused: boolean;
    frameIndex?: number;
}

export const IntermitentSound: FunctionComponent<Props> = ({
    soundValue,
    isPaused,
    frameIndex,
}: Props) => {
    const [lastFrame, setLastFrame] = useState<number>(frameIndex || 0)
    const [soundControl, setSoundControl] = useState<SoundControl | null>(null)

    const startSound = (soundValue: SoundValue | undefined): void => {
        if (soundValue) {
            soundControl?.stop()
            setSoundControl(soundService.play(soundValue.soundId, { 
                loop: false, 
                volume: soundValue.volume 
            }))
        } else {
            setSoundControl(null)
        }
    }

    const startSoundCallback = useCallback(startSound, [soundControl])

    // play the sound when the animation reaches the frameIndex
    useEffect(() => {
        if (soundValue && frameIndex === soundValue?.frameIndex && frameIndex !== lastFrame) {
            startSoundCallback(soundValue)
        }
        setLastFrame(frameIndex || 0)
    }, [frameIndex, lastFrame, startSoundCallback, soundValue])


    // stop the current sound if game is paused
    // (with return function) stop the sound when unmounting
    useEffect(() => {
        if (isPaused && soundControl) {
            soundControl.stop()
            setSoundControl(null)
        }
        return (): void => {
            soundControl?.stop()
        }
    }, [isPaused, soundControl, soundValue])

    return null
}