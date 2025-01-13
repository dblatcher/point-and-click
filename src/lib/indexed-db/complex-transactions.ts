import { GameDesign } from "@/definitions";
import { ImageService } from "@/services/imageService";
import { setHrefsFromFiles } from "@/services/set-hrefs";
import { SoundService } from "@/services/soundService";
import { makeAssetRecordKey, retrieveImageAssets, retrieveSoundAssets } from "./asset-stores-transactions";
import { GameEditorDatabase, SavedDesignKey } from "./types";
import { retrieveSavedDesign } from "./design-store-transactions";

// TO DO - think about how we can revoke the object URLs when removing from the services...
const retrieveDesignAndAssets = (db: GameEditorDatabase) => async (
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

    const imageAssets = setHrefsFromFiles(imageAssetResults)
    const soundAssets = setHrefsFromFiles(soundAssetResults)

    return { design, timestamp, imageAssets, soundAssets }
}

// TO DO - this function is no longer about the DB, but mostly about populating the services/
// where does it live?
export const retrieveDesignAndPopulateAssets = (db: GameEditorDatabase) => async (
    savedDesignKey: SavedDesignKey,
    soundService: SoundService,
    imageService: ImageService,
) => {
    const { design, timestamp, imageAssets, soundAssets } = await retrieveDesignAndAssets(db)(savedDesignKey)

    if (!design) {
        return undefined
    }
    imageService.populate(imageAssets, 'DB')
    soundService.populate(soundAssets, 'DB')
    const date = new Date(timestamp)
    console.log(`retrieved ${savedDesignKey} last saved at ${date.toLocaleDateString()},  ${date.toLocaleTimeString()}`)
    return design
}

export const storeDesignAndAllAssetsToDb = (db: GameEditorDatabase) => async (
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