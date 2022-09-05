import { FunctionalComponent } from "preact";
import { SoundControl } from "physics-worlds";
import { useCallback, useEffect, useState } from "preact/hooks";
import soundService from "../services/soundService";
import type { SoundValue } from "src";

interface Props {
    soundValue?: SoundValue;
    isPaused: boolean;
    frameIndex?: number;
}

export const IntermitentSound: FunctionalComponent<Props> = ({
    soundValue,
    isPaused,
    frameIndex,
}: Props) => {
    const [lastFrame, setLastFrame] = useState<number>(frameIndex || 0)
    const [soundControl, setSoundControl] = useState<SoundControl | null>(null)

    const startSound = (soundValue: SoundValue): void => {
        if (soundValue.soundId) {
            soundControl?.stop()
            setSoundControl(soundService.play(soundValue.soundId, { loop: false, volume: soundValue.volume }))
        } else {
            setSoundControl(null)
        }
    }

    const startSoundCallBack = useCallback(startSound, [soundControl])

    // play the sound when the animation reaches the frameIndex
    useEffect(() => {
        if (soundValue && frameIndex === soundValue?.frameIndex && frameIndex !== lastFrame) {
            startSoundCallBack(soundValue)
        }
        setLastFrame(frameIndex || 0)
    }, [frameIndex, lastFrame, startSoundCallBack, soundValue])


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