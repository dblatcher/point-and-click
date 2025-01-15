import { Divider, Grid } from "@mui/material"
import { DesignCard } from "./DesignCard"
import { MarkDown } from "./MarkDown"
import castleLifeBlurb from "@/content/castleLifeBlurb.md";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { GameDesign } from "@/definitions";
import { readGameFromZipFile } from "@/lib/zipFiles";



const loadGameFromUrlFunction = (
    downloadUrl: string,
    onLoad: { (design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]): void },
    onError: { (message: string): void },
) => async (
    ) => {
        if (!downloadUrl) {
            return
        }
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


export const GameList = (props: {
    onLoad: { (design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]): void }
    onError: { (message: string): void }
}) => {

    const { onError, onLoad } = props

    return (
        <Grid container spacing={2} padding={2}
            justifyContent="center"
            alignItems="center">
            <Grid item xs={9}>
                <DesignCard title="Castle Life"
                    downloadUrl="/assets/castle-life.game.zip"
                    imageUrl="/assets/sword.png"
                    loadGame={loadGameFromUrlFunction("/assets/castle-life.game.zip", onLoad, onError)}
                    content={
                        <MarkDown content={castleLifeBlurb} />
                    } />

                <Divider sx={{ margin: 2 }} />

                <DesignCard title="Test Game"
                    downloadUrl="/assets/THE_TEST_GAME.game.zip"
                    imageUrl="/assets/things/tube.png"
                    loadGame={loadGameFromUrlFunction("/assets/THE_TEST_GAME.game.zip", onLoad, onError)}
                    content={
                        <MarkDown content={'A test game to illustrate how some of the features work.'} />
                    } />
            </Grid>
        </Grid>
    )

}