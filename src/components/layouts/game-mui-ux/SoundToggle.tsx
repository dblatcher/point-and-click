import VolumeMute from '@mui/icons-material/VolumeMute';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { Button, IconButton } from "@mui/material";
import { GameDataContext } from "point-click-components";
import { useContext } from "react";

interface Props {
    buttonType?: 'IconButton' | 'Button'
    color?: "secondary" | "inherit" | "primary" | "error" | "info" | "success" | "warning"
}

export function SoundToggle({ buttonType = 'IconButton', color = 'inherit' }: Props) {

    const { gameState: { isSoundDisabled }, dispatch } = useContext(GameDataContext)

    const toggle = () => {
        dispatch({ type: 'SET-SOUND-DISABLED', isSoundDisabled: !isSoundDisabled })
    }

    switch (buttonType) {
        case "IconButton":
            return (
                <IconButton onClick={toggle} color={color}>
                    {!isSoundDisabled ? <VolumeUp /> : <VolumeMute />}
                </IconButton>
            )
        case "Button":
            return (
                <Button onClick={toggle} color={color} startIcon={!isSoundDisabled ? <VolumeUp /> : <VolumeMute />}>
                    Sound
                </Button>
            )
    }
}
