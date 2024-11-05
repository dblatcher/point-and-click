import { SoundAsset } from "@/services/assets";
import React from "react";
import { EditorBox } from "../EditorBox";
import { Box, Typography } from "@mui/material";

interface Props {
    asset: Partial<SoundAsset>
    temporarySrc?: string
    temporaryFileName?: string
}


export const SoundPreview: React.FunctionComponent<Props> = ({ asset, temporarySrc, temporaryFileName }: Props) => {
    const { href, id, category } = asset

    const usingAsset = !!(href && id)
    const label = usingAsset ? id : temporarySrc ? temporaryFileName ?? '[no name]' : '[no sound file]'

    const audioSource = href ?? temporarySrc

    return <EditorBox title="play sound" contentBoxProps={{display:'flex', flexDirection:'column'}}>
        <Box display='flex' gap={2} alignItems={'center'}>
            <Typography variant="overline" >{usingAsset ? 'asset:' : 'file:'}</Typography>
            <Typography fontWeight={'bold'}>{label}</Typography>
        </Box>
        <Typography variant="overline" >category: {category ?? 'unset'}</Typography>
        <audio controls key={audioSource} src={audioSource} controlsList="nodownload noplaybackrate"></audio>
    </EditorBox>

}