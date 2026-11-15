import { SoundAsset } from "@/services/assets";
import React from "react";
import { EditorBox } from "../layout/EditorBox";
import { Box, Typography } from "@mui/material";
import { formatFileSize } from "@/lib/util";

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
            <Typography fontWeight={700} textAlign={'center'}>{getLabel()}</Typography>
            <Box display={'flex'} gap={10}>
                <Typography variant="overline" >category: {category ?? 'unset'}</Typography>
                {asset.size && (
                    <Typography variant="overline" >{formatFileSize(asset.size)}</Typography>
                )}
            </Box>
            <audio controls key={audioSource} src={audioSource} controlsList="nodownload noplaybackrate"></audio>
        </EditorBox>
    )
}