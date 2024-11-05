import { useAssets } from "@/context/asset-context";
import { useEffect, useState } from "react";

export function SoundToggle() {
    const { soundService } = useAssets()
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
            {isOn ? '🔊' : '🔇'}
        </button>
    )
}