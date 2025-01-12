import { ImageService } from "@/services/imageService";
import { SoundService } from "@/services/soundService";
import { retrieveImageAssets, retrieveSavedDesign, retrieveSoundAssets } from "./transactions";
import { GameEditorDatabase, SavedDesignKey } from "./types";
import { GameDesign } from "@/definitions";

export const retrieveDesignAndPopulateAssets = (db: GameEditorDatabase) => async (
    key: SavedDesignKey,
    soundService: SoundService,
    imageService: ImageService,
) => {

    const [
        { design, timestamp = 0 },
        imageAssetResults,
        soundAssetResults
    ] = await Promise.all([
        retrieveSavedDesign(db)(key),
        retrieveImageAssets(db)(key),
        retrieveSoundAssets(db)(key)
    ]);

    if (!design) {
        return undefined
    }

    imageService.remove(imageService.list(), 'DB')
    soundService.remove(imageService.list(), 'DB')
    imageService.addFromFile(imageAssetResults, 'DB')
    soundService.addFromFile(soundAssetResults, 'DB')

    const date = new Date(timestamp)
    console.log(`retrieved ${key} last saved at ${date.toLocaleDateString()},  ${date.toLocaleTimeString()}`)

    return design
}

export const saveDesignAndAllAssetsToDb = (db: GameEditorDatabase) => async (
    gameDesign: GameDesign,
    key: SavedDesignKey,
    soundService: SoundService,
    imageService: ImageService,
) => {

    const allSoundAssetsAndFiles = Promise.all(soundService.list().map(soundService.getWithFile))
    const allImageAssetsAndFiles = Promise.all(imageService.list().map(imageService.getWithFile))

    // TO DO 
    // key all files from both services
    // - transaction
    // delete all image assets matching key
    // delete all sound assets matching key
    // put new files 
    // put new game design

}