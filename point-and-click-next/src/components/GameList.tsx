import { Divider, Grid } from "@mui/material"
import { DesignCard } from "./DesignCard"
import { MarkDown } from "./MarkDown"
import castleLifeBlurb from "@/content/castleLifeBlurb.md";

export const GameList = () => {

    return (
        <Grid container spacing={2} padding={2}
            justifyContent="center"
            alignItems="center">
            <Grid item xs={9}>
                <DesignCard title="Castle Life"
                    downloadUrl="/assets/castle-life.game.zip"
                    imageUrl="/assets/sword.png"
                    content={
                        <MarkDown content={castleLifeBlurb} />
                    } />

                <Divider sx={{ margin: 2 }} />

                <DesignCard title="Test Game"
                    downloadUrl="/assets/THE_TEST_GAME.game.zip"
                    imageUrl="/assets/things/tube.png"
                    content={
                        <MarkDown content={'A test game to illustrate how some of the features work.'} />
                    } />
            </Grid>
        </Grid>
    )

}