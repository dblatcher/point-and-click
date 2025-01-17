import DownloadIcon from '@mui/icons-material/Download';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import { Avatar, ButtonProps, IconButton, IconButtonProps, ListItem, ListItemAvatar, ListItemButton, ListItemText, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface Props {
    title: string,
    downloadUrl?: string,
    downloadFunction?: { (): Promise<void> }
    imageUrl?: string,
    content?: ReactNode,
    loadGame: { (): Promise<void> }
}


export const DesignCard = ({ title, downloadUrl, imageUrl, content, loadGame, downloadFunction }: Props) => {

    const theme = useTheme();

    const avatar = imageUrl
        ? <Avatar src={imageUrl} alt='' sx={{ bgcolor: theme.palette.primary.dark }} />
        : <Avatar sx={{ bgcolor: theme.palette.primary.dark }} ><DesignServicesOutlinedIcon /> </Avatar>


    const downloadAction = downloadUrl
        ? <IconButton href={downloadUrl} download title={`download ${title}`}>
            <DownloadIcon fontSize="large" color={'primary'} />
        </IconButton>
        : downloadFunction
            ? <IconButton onClick={downloadFunction} title={`download ${title}`}>
                <DownloadIcon fontSize="large" color={'primary'} />
            </IconButton>
            : undefined

    return (
        <ListItem
            secondaryAction={downloadAction}
        >
            <ListItemButton onClick={loadGame} >
                <ListItemAvatar>
                    {avatar}
                </ListItemAvatar>
                <ListItemText
                    primary={title}
                    secondary={content}
                />
            </ListItemButton>
        </ListItem>
    )

}