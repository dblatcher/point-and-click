import soundService from "@/services/soundService"
import { IconButton, IconButtonProps } from "@mui/material"
import React, { useRef } from "react"
import { PlayCircleOutlineOutlinedIcon } from "./material-icons"

type Props = IconButtonProps & {
    soundAssetId?: string
}


export const SoundAssetTestButton: React.FunctionComponent<Props> = ({ soundAssetId, ...rest }) => {

    const audioRef = useRef<HTMLAudioElement>(null)
    const asset = soundAssetId ? soundService.get(soundAssetId) : undefined

    const handleClick = () => {
        const { current: audioElement } = audioRef
        if (!audioElement) {
            return
        }

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