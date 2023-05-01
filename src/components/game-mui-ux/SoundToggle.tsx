import { useEffect, useState } from "react";
import soundService from "@/services/soundService";

import VolumeMute from '@mui/icons-material/VolumeMute'
import VolumeUp from '@mui/icons-material/VolumeUp'
import { IconButton } from "@mui/material";

export function SoundToggle() {

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
        <IconButton onClick={toggle} color='primary'>
            {isOn ? <VolumeUp /> : <VolumeMute />}
        </IconButton>
    )
}