import castleLifeBlurb from "@/content/castleLifeBlurb.md";
import { GameDesign } from "@/definitions";
import { buildGameZipBlobFromAssets, readGameFromZipFile } from "@/lib/zipFiles";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { List } from "@mui/material";
import { GameLoaderDesignItem } from "./GameLoaderDesignItem";
import { getGameFromApi } from "@/lib/api-usage";
import { makeDownloadFile } from "@/lib/files";

interface Props {
    onLoad: { (design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]): void }
    onError: { (message: string): void }
}

const loadGameFromZipFileUrl = (
    downloadUrl: string,
    onLoad: Props['onLoad'],
    onError: Props['onError'],
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


const loadGameFromApi = (
    onLoad: Props['onLoad'],
    onError: Props['onError'],
) => async () => {
    try {
        const { gameDesign, imageAssets, soundAssets } = await getGameFromApi();
        onLoad(gameDesign, imageAssets, soundAssets)
    } catch (error) {
        onError('failed to load')
    }
}

const downloadFromApi = (
    onError: Props['onError'],
) => async () => {
    const { gameDesign, imageAssets, soundAssets } = await getGameFromApi();
    const zipResult = await buildGameZipBlobFromAssets(gameDesign, imageAssets, soundAssets)
    if (zipResult.success) {
        makeDownloadFile(`${gameDesign.id}.game.zip`, zipResult.blob);
    } else {
        onError(`download failed`)
    }
}

export const GameList = ({ onError, onLoad }: Props) => {

    return (
        <List dense>
            <GameLoaderDesignItem title="Castle Life"
                downloadUrl="/assets/castle-life.game.zip"
                imageUrl="/assets/sword.png"
                loadGame={loadGameFromZipFileUrl("/assets/castle-life.game.zip", onLoad, onError)}
                content={
                    castleLifeBlurb
                } />
            <GameLoaderDesignItem title="Test Game"
                downloadFunction={downloadFromApi(onError)}
                imageUrl="/assets/things/tube.png"
                loadGame={loadGameFromApi(onLoad, onError)}
                content={
                    'A test game to illustrate how some of the features work.'
                } />
        </List>
    )

}