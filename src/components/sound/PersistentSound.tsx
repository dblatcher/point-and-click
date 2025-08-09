import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { SoundControl } from "sound-deck";
import type { SoundValue } from "@/definitions";
import { useAssets } from "@/context/asset-context";

interface Props {
    soundValue?: SoundValue;
    isPaused: boolean;
}

export const PersistentSound: FunctionComponent<Props> = ({
    soundValue,
    isPaused,
}: Props) => {
    const [soundControl, setSoundControl] = useState<SoundControl | null>(null)
    const [stateSoundValue, setStateSoundValue] = useState<SoundValue | undefined>(undefined)
    const { soundService } = useAssets()

    const startSound = useCallback((newSoundValue: SoundValue | undefined): void => {
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
    }, [soundControl, soundService])


    const adjustVolume = useCallback((volume: number) => {
        if (soundControl) {
            soundControl.volume = volume
        }
    }, [soundControl])

    const reactToSoundBeingEnabled = (isEnabled: boolean): void => {
        if (isEnabled && stateSoundValue && !soundControl) {
            startSound(stateSoundValue)
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
            startSound(stateSoundValue)
        }
        return (): void => {
            soundControl?.stop()
        }
    }, [isPaused, soundControl, stateSoundValue, startSound])

    useEffect(() => {
        if (stateSoundValue !== soundValue) {
            if (soundValue && stateSoundValue?.soundId === soundValue?.soundId) {
                return adjustVolume(soundValue?.volume ?? 1)
            }

            startSound(soundValue)
        }
    }, [stateSoundValue, soundValue, startSound, adjustVolume])

    return null
}