import { ImageService } from "@/services/imageService";
import { SoundService } from "@/services/soundService";
import { makeAssetRecordKey, retrieveImageAssets, retrieveSavedDesign, retrieveSoundAssets } from "./transactions";
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