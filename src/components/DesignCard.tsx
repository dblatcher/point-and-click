import { Card, Link, Typography, Avatar, Grid, useTheme, Button } from "@mui/material"
import DownloadIcon from '@mui/icons-material/Download';
import { ReactNode } from "react";
import { readGameFromZipFile } from "@/lib/zipFiles";
import { GameDesign } from "@/definitions";
import { ImageAsset, SoundAsset } from "@/services/assets";

interface Props {
    title: string,
    downloadUrl: string,
    imageUrl?: string,
    content?: ReactNode,
    onLoad: { (design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]): void }
    onError: { (message: string): void }
}


export const DesignCard = ({ title, downloadUrl, imageUrl, content, onLoad, onError }: Props) => {

    const loadGameFromUrl = async () => {
        try {
            const response = await fetch(downloadUrl);
            const blob = await response.blob()
            const game = await readGameFromZipFile(blob)
            if (game.success) {
                onLoad(game.data.gameDesign, game.data.imageAssets, game.data.soundAssets)
            } else {
                onError(`Invalid game file from: ${downloadUrl}`)
            }
        } catch (err) {
            console.warn(err)
            onError(`Failed to load game from: ${downloadUrl}`)
        }
    }

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
                    <Button onClick={loadGameFromUrl}>
                        <Typography variant="h4" textTransform={'none'}>{title}</Typography>
                    </Button>
                </Grid>
                <Grid item xs={1}>
                    <Link href={downloadUrl} download title={`download ${title}`}>
                        <DownloadIcon fontSize="large" color={'primary'} />
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