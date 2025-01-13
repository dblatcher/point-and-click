import { ImageService } from "@/services/imageService";
import { SoundService } from "@/services/soundService";
import { makeAssetRecordKey, retrieveImageAssets, retrieveSavedDesign, retrieveSoundAssets } from "./transactions";
import { GameEditorDatabase, SavedDesignKey } from "./types";
import { GameDesign } from "@/definitions";

// TO DO - maybe this function should handle using the File to populate the
// href in the Asset with the Object URL
// would like to consolidate that operation, maybe do away with AssetService.addFromFile
// so retrieveDesignAndPopulateAssets can just use AssetService.Populate
// also think about how we can revoke the object URLs when removing from the services...
export const retrieveDesignAndAssets = (db: GameEditorDatabase) => async (
    key: SavedDesignKey,
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
    return { design, timestamp, imageAssetResults, soundAssetResults }
}


// TO DO - this function is no longer about the DB, but mostly about populating the services/
// where does it live?

export const retrieveDesignAndPopulateAssets = (db: GameEditorDatabase) => async (
    key: SavedDesignKey,
    soundService: SoundService,
    imageService: ImageService,
) => {

    const { design, timestamp, imageAssetResults, soundAssetResults } = await retrieveDesignAndAssets(db)(key)

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
    savedDesignKey: SavedDesignKey,
    soundService: SoundService,
    imageService: ImageService,
) => {

    const [
        allSoundAssetsAndFiles,
        allImageAssetsAndFiles,
        imagesInDb,
        soundsInDb,
    ] = await Promise.all([
        soundService.getAllWithFiles(),
        imageService.getAllWithFiles(),
        db.getAllKeysFromIndex('image-assets', 'by-design-key', savedDesignKey),
        db.getAllKeysFromIndex('sound-assets', 'by-design-key', savedDesignKey),
    ])


    const tx = db.transaction(['image-assets', 'sound-assets', 'designs'], 'readwrite');
    const imageStore = tx.objectStore('image-assets')
    const soundStore = tx.objectStore('sound-assets')

    imagesInDb.forEach(assetKey => {
        imageStore.delete(assetKey)
    })
    soundsInDb.forEach(assetKey => {
        soundStore.delete(assetKey)
    })
    allImageAssetsAndFiles.forEach(({ asset, file }) => {
        imageStore.put({ savedDesign: savedDesignKey, asset: { ...asset, img: undefined }, file }, makeAssetRecordKey(savedDesignKey, asset.id))
    })
    allSoundAssetsAndFiles.forEach(({ asset, file }) => {
        soundStore.put({ savedDesign: savedDesignKey, asset, file }, makeAssetRecordKey(savedDesignKey, asset.id))
    })
    tx.objectStore('designs').put({ design: gameDesign, timestamp: Date.now() }, savedDesignKey)

    return tx.done
}