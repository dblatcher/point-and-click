import { useEffect, useState } from "react";
import soundService from "@/services/soundService";
import VolumeMute from '@mui/icons-material/VolumeMute'
import VolumeUp from '@mui/icons-material/VolumeUp'
import { IconButton, Button } from "@mui/material";

interface Props {
    buttonType?: 'IconButton' | 'Button'
    color?: "secondary" | "inherit" | "primary" | "error" | "info" | "success" | "warning"
}

export function SoundToggle({ buttonType = 'IconButton', color = 'inherit' }: Props) {

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

    switch (buttonType) {
        case "IconButton":
            return (
                <IconButton onClick={toggle} color={color}>
                    {isOn ? <VolumeUp /> : <VolumeMute />}
                </IconButton>
            )
        case "Button":
            return (
                <Button onClick={toggle} color={color} startIcon={isOn ? <VolumeUp /> : <VolumeMute />}>
                    Sound
                </Button>
            )
    }
}
