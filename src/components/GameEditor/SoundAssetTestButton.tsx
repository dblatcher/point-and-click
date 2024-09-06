import soundService from "@/services/soundService"
import { IconButton, IconButtonProps } from "@mui/material"
import React, { useRef } from "react"
import { PlayCircleOutlineOutlinedIcon } from "./material-icons"
import { clamp } from "@/lib/util"

type Props = IconButtonProps & {
    soundAssetId?: string
    volume?: number
}


export const SoundAssetTestButton: React.FunctionComponent<Props> = ({ soundAssetId, volume, ...rest }) => {

    const audioRef = useRef<HTMLAudioElement>(null)
    const asset = soundAssetId ? soundService.get(soundAssetId) : undefined

    const handleClick = () => {
        const { current: audioElement } = audioRef
        if (!audioElement) {
            return
        }
        audioElement.volume = clamp( volume ?? 1)
        audioElement.play()
    }

    return <IconButton {...rest} onClick={handleClick} disabled={!asset}>
        <PlayCircleOutlineOutlinedIcon fontSize={'large'} />
        <audio
            ref={audioRef}
            src={asset?.href}
            key={asset?.href}></audio>
    </IconButton>
} 