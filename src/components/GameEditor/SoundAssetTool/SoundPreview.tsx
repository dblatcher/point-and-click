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
    const { href, category } = asset
    const audioSource = temporarySrc ?? href;

    const getLabel = () => {
        if (temporaryFileName) {
            return temporaryFileName
        }
        if (asset.originalFileName) {
            return asset.originalFileName
        }
        return audioSource ? '[unnamed]' : '[no file]';
    }

    return (
        <EditorBox
            title="play sound"
            contentBoxProps={{ display: 'flex', flexDirection: 'column' }}
        >
            <Typography textAlign={'center'}>{getLabel()}</Typography>
            <Typography variant="overline" >category: {category ?? 'unset'}</Typography>
            <audio controls key={audioSource} src={audioSource} controlsList="nodownload noplaybackrate"></audio>
        </EditorBox>
    )
}