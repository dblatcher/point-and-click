import { Card, Link, Typography, Avatar, Grid, useTheme } from "@mui/material"
import DownloadIcon from '@mui/icons-material/Download';
import { ReactNode } from "@mdx-js/react/lib";

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
            backgroundColor: theme.palette.primary.light
        }}>
            <Grid container spacing={1} padding={1} alignItems={'center'} justifyContent={'space-between'}>
                <Grid item xs={1}>
                    {imageUrl && <Avatar src={imageUrl} alt='' sx={{ bgcolor:theme.palette.secondary.dark }} />}
                </Grid>
                <Grid item xs={10}>
                    <Typography variant={'h2'}>{title}</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Link href={downloadUrl} download title={`download ${title}`}>
                        <DownloadIcon color={'secondary'}/>
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