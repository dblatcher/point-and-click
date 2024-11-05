import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { SoundControl } from "sound-deck";
import { useInterval } from "@/lib/useInterval"
import type { SoundValue } from "@/definitions";
import { useAssets } from "@/context/asset-context";

interface Props {
    soundValue?: SoundValue;
    animationRate?: number;
    isPaused: boolean;
}

export const PersistentSound: FunctionComponent<Props> = ({
    soundValue,
    animationRate = 200,
    isPaused,
}: Props) => {
    const [soundControl, setSoundControl] = useState<SoundControl | null>(null)
    const [stateSoundValue, setStateSoundValue] = useState<SoundValue | undefined>(undefined)
    const { soundService } = useAssets()

    const startSound = (newSoundValue: SoundValue | undefined): void => {
        soundControl?.stop()
        if (newSoundValue) {
            setSoundControl(soundService.play(newSoundValue.soundId, {
                loop: true,
                volume: newSoundValue.volume
            }))
        } else {
            setSoundControl(null)
        }
        setStateSoundValue(newSoundValue)
    }
    const startSoundCallback = useCallback(startSound, [soundControl, soundService])

    const reactToSoundBeingEnabled = (isEnabled: boolean): void => {
        if (isEnabled && stateSoundValue && !soundControl) {
            startSoundCallback(stateSoundValue)
        }
    }
    useEffect(() => {
        soundService.on('ready', reactToSoundBeingEnabled)
        return (): void => {
            soundService.off('ready', reactToSoundBeingEnabled)
        }
    })


    // stop the current sound if game is paused
    // play the sound again when unpaused
    // (with return function) stop the sound when unmounting
    useEffect(() => {
        if (isPaused && soundControl) {
            setSoundControl(null)
        } else if (!isPaused && stateSoundValue && !soundControl) {
            startSoundCallback(stateSoundValue)
        }
        return (): void => {
            soundControl?.stop()
        }
    }, [isPaused, soundControl, stateSoundValue, startSoundCallback])

    // on every animation tick, play a new sound if the 
    // prop has changed
    const updateSound = (): void => {
        if (stateSoundValue !== soundValue) {
            startSoundCallback(soundValue)
        }
    }
    useInterval(updateSound, animationRate)
    return null
}