import { Card, Link, Typography, Avatar, Grid } from "@mui/material"
import DownloadIcon from '@mui/icons-material/Download';
import { ReactNode } from "@mdx-js/react/lib";

interface Props {
    title: string,
    downloadUrl: string,
    imageUrl?: string,
    content?: ReactNode,
}


export const DesignCard = ({ title, downloadUrl, imageUrl, content }: Props) => {

    return (
        <Card>
            <Grid container spacing={1} padding={1} alignItems={'center'} justifyContent={'space-between'}>
                <Grid item xs={1}>
                    {imageUrl && <Avatar src={imageUrl} alt='' sx={{ bgcolor: 'red' }} />}
                </Grid>
                <Grid item xs={10}>
                    <Typography fontFamily={'arial'} variant={'h2'} fontSize={20}>{title}</Typography>
                </Grid>
                <Grid item xs={1}>
                    <Link href={downloadUrl} download title={`download ${title}`}>
                        <DownloadIcon />
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