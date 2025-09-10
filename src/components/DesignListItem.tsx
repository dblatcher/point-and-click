import { DB_VERSION, DesignSummary } from '@/lib/indexed-db';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";
import { ReactNode } from "react";

interface Props {
    title: string,
    description?: ReactNode,
    imageUrl?: string,
    secondaryAction?: ReactNode
    onClick: { (): Promise<void> | void }
    schemaVersion?: number
}


export const DescriptionWithSaveTime = ({ timestamp, designSummary }: { timestamp: number, designSummary: DesignSummary }) => {
    const { description } = designSummary
    const date = new Date(timestamp).toLocaleString();
    return <><b>{date}</b>{' '}{description}</>
}

export const DesignListItem = ({ title, imageUrl, description, onClick, secondaryAction, schemaVersion }: Props) => {

    const avatar = imageUrl
        ? <Avatar src={imageUrl} alt='' sx={{ bgcolor: 'primary.dark' }} />
        : schemaVersion && schemaVersion < DB_VERSION
            ? <Avatar sx={{ bgcolor: 'warning.dark' }} >v{schemaVersion} </Avatar>
            : <Avatar sx={{ bgcolor: 'primary.dark' }} ><DesignServicesOutlinedIcon /> </Avatar>

    return (
        <ListItem secondaryAction={secondaryAction}>
            <ListItemButton onClick={onClick} >
                <ListItemAvatar>{avatar}</ListItemAvatar>
                <ListItemText
                    primary={title}
                    secondary={description}
                />
            </ListItemButton>
        </ListItem>
    )
}