import { Divider, Grid } from "@mui/material"
import { DesignCard } from "./DesignCard"
import { MarkDown } from "./MarkDown"
import castleLifeBlurb from "@/content/castleLifeBlurb.md";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { GameDesign } from "@/definitions";

export const GameList = (props:{
    onLoad: { (design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]): void }
    onError: { (message: string): void }
}) => {

    return (
        <Grid container spacing={2} padding={2}
            justifyContent="center"
            alignItems="center">
            <Grid item xs={9}>
                <DesignCard title="Castle Life"
                    downloadUrl="/assets/castle-life.game.zip"
                    imageUrl="/assets/sword.png"
                    {...props}
                    content={
                        <MarkDown content={castleLifeBlurb} />
                    } />

                <Divider sx={{ margin: 2 }} />

                <DesignCard title="Test Game"
                    downloadUrl="/assets/THE_TEST_GAME.game.zip"
                    imageUrl="/assets/things/tube.png"
                    {...props}
                    content={
                        <MarkDown content={'A test game to illustrate how some of the features work.'} />
                    } />
            </Grid>
        </Grid>
    )

}