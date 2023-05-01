import { Card, Link, Typography, Avatar, Grid, useTheme } from "@mui/material"
import DownloadIcon from '@mui/icons-material/Download';
import { ReactNode } from "react";

interface Props {
    title: string,
    downloadUrl: string,
    imageUrl?: string,
    content?: ReactNode,
}


export const DesignCard = ({ title, downloadUrl, imageUrl, content }: Props) => {

    const theme = useTheme();
    return (
        <Card sx={{
            backgroundColor: theme.palette.secondary.light,
            fontFamily: theme.typography.fontFamily,
        }}>
            <Grid container spacing={1} padding={1} alignItems={'center'} justifyContent={'space-between'}>
                <Grid item xs={1}>
                    {imageUrl && <Avatar src={imageUrl} alt='' sx={{ bgcolor:theme.palette.primary.dark }} />}
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="h4">{title}</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Link href={downloadUrl} download title={`download ${title}`}>
                        <DownloadIcon color={'primary'}/>
                    </Link>
                </Grid>
            </Grid>

            {content && (
                <Grid container spacing={1} padding={1} alignItems={'center'} justifyContent={'space-between'}>
                    <Grid item xs={12}>
                        {content}
                    </Grid>
                </Grid>
            )}
        </Card>
    )

}