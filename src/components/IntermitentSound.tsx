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
    const [soundId, setSoundId] = useState<string | undefined>()

    const startSound = (newSoundId: string | undefined): void => {
        if (newSoundId) {
            soundControl?.stop()
            setSoundControl(soundService.play(newSoundId, { loop: false }))
        } else {
            setSoundControl(null)
        }
        setSoundId(newSoundId)
    }

    const startSoundCallBack = useCallback(startSound, [])

    useEffect(() => {
        if (frameIndex === soundValue?.frameIndex && frameIndex !== lastFrame) {
            startSoundCallBack(soundValue?.soundId)
        }
        setLastFrame(frameIndex || 0)
    }, [frameIndex, lastFrame, startSoundCallBack, soundValue])


    useEffect(() => {
        if (isPaused && soundControl) {
            soundControl.stop()
            setSoundControl(null)
        }
        return (): void => {
            soundControl?.stop()
        }
    }, [isPaused, soundControl, soundId])

    return null
}