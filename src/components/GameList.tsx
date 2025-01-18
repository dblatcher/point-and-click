import castleLifeBlurb from "@/content/castleLifeBlurb.md";
import { GameDesign } from "@/definitions";
import { readGameFromZipFile } from "@/lib/zipFiles";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { GameLoaderDesignItem } from "./GameLoaderDesignItem";
import { MarkDown } from "./MarkDown";
import { List } from "@mui/material";



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
        <List dense>
            <GameLoaderDesignItem title="Castle Life"
                downloadUrl="/assets/castle-life.game.zip"
                imageUrl="/assets/sword.png"
                loadGame={loadGameFromUrlFunction("/assets/castle-life.game.zip", onLoad, onError)}
                content={
                    castleLifeBlurb
                } />
            <GameLoaderDesignItem title="Test Game"
                downloadUrl="/assets/THE_TEST_GAME.game.zip"
                imageUrl="/assets/things/tube.png"
                loadGame={loadGameFromUrlFunction("/assets/THE_TEST_GAME.game.zip", onLoad, onError)}
                content={
                    'A test game to illustrate how some of the features work.'
                } />
        </List>
    )

}