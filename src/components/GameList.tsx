import castleLifeBlurb from "@/content/castleLifeBlurb.md";
import { GameDesign } from "@/definitions";
import { getGameFromApi, ValidGameId } from "@/lib/api-usage";
import { makeDownloadFile } from "@/lib/files";
import { buildGameZipBlobFromAssets } from "@/lib/zipFiles";
import { ImageAsset, SoundAsset } from "@/services/assets";
import { List } from "@mui/material";
import { GameLoaderDesignItem } from "./GameLoaderDesignItem";

interface Props {
    onLoad: { (design: GameDesign, imageAssets: ImageAsset[], soundAssets: SoundAsset[]): void }
    onError: { (message: string): void }
}

const loadGameFromApi = (
    gameId: ValidGameId,
    onLoad: Props['onLoad'],
    onError: Props['onError'],
) => async () => {
    const result = await getGameFromApi(gameId);
    if (!result.success) {
        onError(`failed to load: ${result.failureMessage}`)
        return
    }
    const { gameDesign, imageAssets, soundAssets } = result.data;
    onLoad(gameDesign, imageAssets, soundAssets)
}

const downloadFromApi = (
    gameId: ValidGameId,
    onError: Props['onError'],
) => async () => {
    const result = await getGameFromApi(gameId);
    if (!result.success) {
        onError(`download failed: ${result.failureMessage}`)
        return
    }
    const { gameDesign, imageAssets, soundAssets } = await result.data;

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
                downloadFunction={downloadFromApi('castle-life', onError)}
                imageUrl="/assets/sword.png"
                loadGame={loadGameFromApi('castle-life', onLoad, onError)}
                content={
                    castleLifeBlurb
                } />
            <GameLoaderDesignItem title="Test Game"
                downloadFunction={downloadFromApi('test', onError)}
                imageUrl="/assets/things/tube.png"
                loadGame={loadGameFromApi('test', onLoad, onError)}
                content={
                    'A test game to illustrate how some of the features work.'
                } />
        </List>
    )

}