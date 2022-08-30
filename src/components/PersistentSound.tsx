import { FunctionalComponent } from "preact";
import { SoundControl } from "physics-worlds";
import { useEffect, useState } from "preact/hooks";
import { useInterval } from "../lib/useInterval"
import soundService from "../services/soundService";

interface Props {
    soundProp?: string;
    animationRate?: number;
    isPaused: boolean;
}

export const PersistentSound: FunctionalComponent<Props> = ({
    soundProp,
    animationRate = 200,
    isPaused,
}: Props) => {

    const [soundControl, setSoundControl] = useState<SoundControl | null>(null)
    const [soundId, setSoundId] = useState<string | undefined>()

    const startSound = (newSoundId: string | undefined): void => {
        if (newSoundId) {
            setSoundControl(soundService.play(newSoundId, { loop: true }))
        } else {
            setSoundControl(null)
        }
        setSoundId(newSoundId)
    }

    const reactToSoundBeingEnabled = (isEnabled: boolean): void => {
        if (isEnabled && soundId && !soundControl) {
            startSound(soundId)
        }
    }

    const updateSound = (): void => {
        if (soundId !== soundProp) {
            soundControl?.stop()
            startSound(soundProp)
        }
    }

    useEffect(() => {
        soundService.on('ready', reactToSoundBeingEnabled)
        return (): void => {
            soundService.off('ready', reactToSoundBeingEnabled)
        }
    })

    useEffect(() => {
        if (isPaused && soundControl) {
            soundControl.stop()
            setSoundControl(null)
        } else if (!isPaused && soundId && !soundControl) {
            startSound(soundId)
        }
    }, [isPaused, soundControl, soundId])

    useInterval(updateSound, animationRate)
    return null
}