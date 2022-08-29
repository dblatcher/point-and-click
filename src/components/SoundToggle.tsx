/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { h } from "preact"
import { useEffect, useState } from "preact/hooks";
import soundService from "../services/soundService";


interface Props {
    _s?: boolean;
}

export function SoundToggle({ }: Props) {

    const [isOn, setIsOn] = useState(soundService.isEnabled)

    const respondToServiceUpdate = (isReady: boolean) => {
        setIsOn(isReady)
    }

    useEffect(() => {
        soundService.on('ready', respondToServiceUpdate)
        return () => {
            soundService.off('ready', respondToServiceUpdate)
        }
    })

    const toggle = () => {
        if (soundService.isEnabled) {
            return soundService.disable()
        }
        soundService.enable()
    }

    return (
        <button onClick={toggle}>
            SOUND
            {isOn ? '🔊' : '🔈'}
        </button>
    )
}