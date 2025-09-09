import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from "@mui/material";
import { ReactNode } from "react";
import { DesignListItem } from './DesignListItem';

interface Props {
    title: string,
    downloadFunction?: { (): Promise<void> }
    imageUrl?: string,
    content?: ReactNode,
    loadGame: { (): Promise<void> }
}


export const GameLoaderDesignItem = ({ title, imageUrl, content, loadGame, downloadFunction }: Props) => {

    const downloadAction = downloadFunction
        ? <IconButton edge='end' onClick={downloadFunction} title={`download ${title}`}>
            <DownloadIcon fontSize="large" color={'primary'} />
        </IconButton>
        : undefined

    return (
        <DesignListItem
            title={title}
            description={content}
            onClick={loadGame}
            imageUrl={imageUrl}
            secondaryAction={downloadAction}
        />
    )

}