import DownloadIcon from '@mui/icons-material/Download';
import { Avatar, Button, Card, Grid, Link, Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface Props {
    title: string,
    downloadUrl?: string,
    imageUrl?: string,
    content?: ReactNode,
    loadGame: { (): Promise<void> }
}


export const DesignCard = ({ title, downloadUrl, imageUrl, content, loadGame }: Props) => {

    const theme = useTheme();
    return (
        <Card sx={{
            backgroundColor: theme.palette.secondary.light,
            fontFamily: theme.typography.fontFamily,
        }}>
            <Grid container spacing={1} padding={1} alignItems={'center'} justifyContent={'space-between'}>
                <Grid item xs={1}>
                    {imageUrl && <Avatar src={imageUrl} alt='' sx={{ bgcolor: theme.palette.primary.dark }} />}
                </Grid>
                <Grid item xs={10} justifyContent={'center'} display={'flex'}>
                    <Button onClick={loadGame}>
                        <Typography variant="h4" textTransform={'none'}>{title}</Typography>
                    </Button>
                </Grid>
                <Grid item xs={1}>
                    {downloadUrl &&
                        <Link href={downloadUrl} download title={`download ${title}`}>
                            <DownloadIcon fontSize="large" color={'primary'} />
                        </Link>
                    }
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